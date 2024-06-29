import { Request, Response } from "express";
import { IRequest } from "../interfaces";
import { SurveyService } from "../services";
import { catchAsync } from "../middlewares";

const SurveyController = {
  createSurvey: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    return await SurveyService.createSurvey(res, user.id, req.body);
  }),

  getActiveSurveys: catchAsync(async (req: Request, res: Response) => {
    return await SurveyService.getActiveSurveys(res);
  }),

  getMySurveys: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    const userId = user.id;
    return await SurveyService.getMySurveys(res, userId);
  }),

  getSurveyById: catchAsync(async (req: Request, res: Response) => {
    return await SurveyService.getSurveyById(res, req.params.id);
  }),

  answerSurvey: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    const userId = user.id;
    return await SurveyService.answerSurvey(
      res,
      userId,
      req.params.id,
      req.body
    );
  }),
};

export default SurveyController;
