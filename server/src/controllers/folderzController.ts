import { Request, Response } from "express";
import { query } from "../config/dbConfig";
import { verifyUser } from "../util/verificationFunctions";

const onStoreUserFolders = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let folderData = req.body;
  let {
    id: folder_id,
    name: folder_name,
    color: folder_color,
    chats,
  } = folderData;
  try {
    await query(
      `INSERT INTO user_folders (folder_id, folder_name, folder_color, chats, user_id)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (folder_id)
      DO UPDATE SET
      folder_name = EXCLUDED.folder_name,
      user_id = EXCLUDED.user_id,
      folder_color = EXCLUDED.folder_color,
      chats = EXCLUDED.chats`,
      [folder_id, folder_name, folder_color, chats, userId]
    );

    res.status(201).json({
      message: "The folder was inserted successfully",
    });
  } catch (error) {
    console.error(`There was an error storing a folder of: ${userId}`);
    res.status(500).json({
      message: "Something went wrong storing your folder, please try again!",
    });
  }
};

const onGetUserFolders = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  try {
    let user_folderz = query("SELECT * FROM user_folders WHERE user_id=$1", [
      userId,
    ]);

    let folderz = (await user_folderz)?.rows;
    res.status(200).json({
      folders: folderz,
      success: true,
      message: "successfully retrieved user folders",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "There was a problem retrieving user folders",
    });
  }
};

const onDeleteFolder = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let { folder_id } = req.query;
  try {
    await query("DELETE FROM user_folders WHERE folder_id=$1 AND user_id=$2", [
      folder_id,
      userId,
    ]);

    res.status(200).json({
      message: "The folder has removed successfully",
      success: true,
    });
  } catch (error) {
    console.error(`There was a problem deleting this user's folder: ${userId}`);
    res.status(500).json({
      success: false,
      message: "There was a problem deleting a folder",
    });
  }
};

const onEditFolder = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user Id or token.",
    });

  const folderData = req.body;
  let { folderId, folderName, colorVal } = folderData;

  try {
    // Fetch current folder data from DB
    const result = await query(
      "SELECT folder_name, folder_color FROM user_folders WHERE folder_id=$1 AND user_id=$2",
      [folderId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Folder not found.",
      });
    }

    const currentFolder = result.rows[0];
    const updates = [];

    // Compare incoming values with existing values
    if (folderName && folderName !== currentFolder.folder_name) {
      updates.push({ field: "folder_name", value: folderName });
    }
    if (colorVal && colorVal !== currentFolder.folder_color) {
      updates.push({ field: "folder_color", value: colorVal });
    }

    // If user has made no changes, return early
    if (updates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes made.",
      });
    }

    // Build the update query dynamically
    const setClause = updates
      .map((update, index) => `${update.field}=$${index + 3}`)
      .join(", ");
    const values = updates.map((update) => update.value);

    const updateQuery = `
      UPDATE user_folders 
      SET ${setClause}
      WHERE folder_id=$1 AND user_id=$2
    `;

    await query(updateQuery, [folderId, userId, ...values]);
    return res.status(200).json({
      success: true,
      message: "Folder updated successfully.",
    });
  } catch (error: any) {
    console.error(`Something went editing folder, user: ${userId}`);
    return res.status(500).json({
      success: false,
      message: "Error updating folder.",
      error: error.message,
    });
  }
};

const onAddChat = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user Id or token.",
    });

  let folderData = req.body;
  let { folderId, chatData } = folderData;
  let { content, chat_id } = chatData;

  try {
    // Check if the chat already exists in the folder
    const existingChats = await query(
      "SELECT chats FROM user_folders WHERE folder_id=$1 AND user_id=$2",
      [folderId, userId]
    );

    const chatExists = existingChats.rows[0].chats.some(
      (chat: { chat_id: string }) => chat.chat_id === chat_id
    );

    // If it exists don't add it to the folder
    if (chatExists) {
      return res.status(400).json({
        success: false,
        message: "Chat already exists.",
      });
    }

    // Add the chat if it doesn't exist
    await query(
      "UPDATE user_folders SET chats = array_append(chats, $1) WHERE folder_id=$2 AND user_id=$3",
      [{ chat_id, content }, folderId, userId]
    );

    res
      .status(200)
      .json({ success: true, message: "Chat added successfully." });
  } catch (error) {
    console.error(
      `Something went wrong adding the chat to the db, user: ${userId}`
    );
    res.status(500).json({ success: false, message: "Error adding chat." });
  }
};

const onRemoveChat = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let folderData = req.body;
  let { folderId, chatId } = folderData;

  try {
    await query(
      "UPDATE user_folders SET chats = array_remove(chats, (SELECT chat FROM unnest(chats) AS chat WHERE chat->>'chat_id'=$1)) WHERE folder_id=$2",
      [chatId, folderId]
    );

    res
      .status(200)
      .json({ success: true, message: "Chat removed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing chat." });
  }
};

let onUpdateFolderOrChat = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let folderToUpdate = req.body;
  let { id: folder_id } = folderToUpdate;

  try {
    let laFolder = await query(
      "SELECT * FROM user_folders WHERE folder_id=$1 AND user_id=$2",
      [folder_id, userId]
    );

    if (laFolder.rows.length > 0) {
      let { id: folder_id, chatData } = folderToUpdate;
      let { chat_id, content } = chatData;

      // Check if the chat already exists in the folder
      const existingChats = await query(
        "SELECT chats FROM user_folders WHERE folder_id=$1 AND user_id=$2",
        [folder_id, userId]
      );

      const chatExists = existingChats.rows[0].chats.some(
        (chat: { chat_id: string }) => chat.chat_id === chat_id
      );

      // If it exists don't add it to the folder
      if (chatExists) {
        return res.status(400).json({
          success: false,
          message: "Chat already exists.",
        });
      }

      await query(
        "UPDATE user_folders SET chats = array_append(chats, $1) WHERE folder_id=$2 AND user_id=$3",
        [{ chat_id, content }, folder_id, userId]
      );
    } else {
      let { id: folder_id, name, color, chats } = folderToUpdate;

      await query(
        `INSERT INTO user_folders (folder_id, folder_name, folder_color, chats, user_id)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (folder_id)
      DO UPDATE SET
      folder_name = EXCLUDED.folder_name,
      user_id = EXCLUDED.user_id,
      folder_color = EXCLUDED.folder_color,
      chats = EXCLUDED.chats`,
        [folder_id, name, color, chats, userId]
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Chat or folder stored successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error storing chat or folder." });
  }
};

export {
  onRemoveChat,
  onAddChat,
  onEditFolder,
  onDeleteFolder,
  onGetUserFolders,
  onStoreUserFolders,
  onUpdateFolderOrChat,
};
