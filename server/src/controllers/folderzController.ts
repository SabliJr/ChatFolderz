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
      message: "successfully retrieved user folders",
    });
  } catch (error) {
    res.status(500).json({
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
    await query("DELETE FROM user_folders WHERE folder_id=$1", [folder_id]);

    res.status(200).json({
      message: "The folder has removed successfully",
    });
  } catch (error) {}
};

const onEditFolder = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

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

  try {
  } catch (error) {}
};

const onRemoveChat = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });

  try {
  } catch (error) {}
};

export {
  onRemoveChat,
  onAddChat,
  onEditFolder,
  onDeleteFolder,
  onGetUserFolders,
  onStoreUserFolders,
};
