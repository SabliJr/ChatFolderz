import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../constants";
import { query } from "../config/dbConfig";
import { checkUserAccess } from "../util/verificationFunctions";

const onGetCredentials = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken && !cookies.userId) return res.sendStatus(401);

  const userId = cookies.userId;
  const accessToken = cookies.accessToken;

  try {
    const decoded = await jwt.verify(
      accessToken as string,
      REFRESH_TOKEN_SECRET as string
    );
    const { user_id: id } = decoded as {
      exp: number;
      user_id: string;
    };

    let user = await query("SELECT * FROM user_profile WHERE user_id=$1", [id]);
    if (user.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    let user_has_payed = await checkUserAccess(userId);
    let { user_id, customer_id, has_access, is_canceled, plan_type } =
      user.rows[0];

    res.status(200).json({
      message: "Everything is fine, the user has payed!",
      user: {
        customer_id: customer_id,
        user_has_payed: user_has_payed,
        user_id: user_id,
        has_access: has_access,
        is_canceled: is_canceled,
        plan_type: plan_type,
      },
    });
  } catch (error) {
    console.error("The was err getting user's credentials: ", error);
    console.error("This was the userId : ", userId);
    res.status(500).json({
      error:
        "Something went wrong getting user's credentials, please refresh the page!",
    });
  }
};

export { onGetCredentials };