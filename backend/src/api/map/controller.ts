import { Request, Response } from 'express';




export const getMap = async (req: Request, res:Response) => {
    console.log("getMap function called")
    res.json({
      success: true,
      data: "🗺️ Map",
      message: "Sending over the map",
    });
}



