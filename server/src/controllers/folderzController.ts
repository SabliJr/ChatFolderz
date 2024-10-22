import { Request, Response } from "express";
import { query } from "../config/dbConfig";
import { verifyUser } from "../util/verificationFunctions";

// Use the verifyUser function in each handler
const onStoreUserFolders = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let { folder_id, folder_name, folder_color, chats } = req.body;
  try {
    await query(
      "INSERT INTO user_folders (folder_id, folder_name, folder_color, chats) VALUES($1, $2, $3, $4)",
      [folder_id, folder_name, folder_color, chats]
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
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let { folder_id, folder_color, folder_name } = req.query;
  try {
  } catch (error) {}
};

const onAddChat = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  let { folder_id, chat_content, chat_id } = req.query;

  try {
    await query(
      "UPDATE user_folders SET chats = array_append(chats, $1) WHERE folder_id = $2",
      [{ chat_id, chat_content }, folder_id]
    );
    res
      .status(200)
      .json({ success: true, message: "Chat added successfully." });
  } catch (error) {
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

  let { folder_id, chat_id } = req.query;
  try {
    await query(
      "UPDATE user_folders SET chats = array_remove(chats, (SELECT chat FROM unnest(chats) AS chat WHERE chat->>'chat_id' = $1)) WHERE folder_id = $2",
      [chat_id, folder_id]
    );

    res
      .status(200)
      .json({ success: true, message: "Chat removed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing chat." });
  }
};

export {
  onRemoveChat,
  onAddChat,
  onEditFolder,
  onDeleteFolder,
  onGetUserFolders,
  onStoreUserFolders,
};
