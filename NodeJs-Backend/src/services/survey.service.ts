import { Response, Request } from "express";
// import UserService from "./user.service";
import { PointsService, AchievementService, UserService } from ".";
import { Survey } from "../models";
import { CreateSurveyDto } from "../dto/survey.dto";
import { surveyAchievements } from "../constants";
import Achievement from "../models/achievement.model";

const SurveyService = {
  createSurvey: async (res: Response, userId: string, dto: CreateSurveyDto) => {
    await Survey.create({ ...dto, createdBy: userId });
    return res.status(201).json({ message: "Survey created" });
  },

  getActiveSurveys: async (res: Response) => {
    const now = new Date(Date.now());
    const surveys = await Survey.find({
      startDate: { $lte: now },
      isClosed: false,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ surveys });
  },

  getAllSurveys: async (res: Response) => {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    return res.status(200).json({ surveys });
  },

  answerSurvey: async (
    req: Request,
    res: Response,
    userId: string,
    surveyId: string,
    dto: any
  ) => {
    let survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const participant = survey.participants.find(
      (participant) => participant.participant.toString() === userId
    );

    if (participant) {
      return res.status(400).json({ message: "Survey already answered" });
    }

    const validatedAnswers = dto.answers.map((answer: any) => {
      if (!answer.question || !answer.type || !answer.answer) {
        throw new Error("Invalid answer structure");
      }
      return {
        question: answer.question,
        type: answer.type,
        options: answer.options || [],
        isRequired: answer.isRequired || false,
        answer: answer.answer,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    survey.participants.push({
      participant: userId,
      answers: validatedAnswers,
    });

    await survey.save();

    const user = await UserService.updateUser(userId, {
      $inc: { surveysAnswered: 1 },
    });

    const achievement = surveyAchievements.find(
      (achievement) => user!.surveysAnswered === achievement.value
    );

    await PointsService.updateUserPoints(req, userId, survey.reward);

    await PointsService.emitLeaderboard(req);

    if (achievement) {
      await AchievementService.createAchievement(
        req,
        userId,
        achievement.title,
        achievement.description
      );

      await PointsService.updateUserPoints(req, userId, achievement.points);

      await PointsService.emitLeaderboard(req);
    }

    return res.status(200).json({ message: "Survey answered" });
  },

  updateSurvey: async (res: Response, id: string, dto: CreateSurveyDto) => {
    let survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    await Survey.findByIdAndUpdate(id, dto);
    return res.status(200).json({ message: "Survey updated" });
  },

  closeSurvey: async (res: Response, id: string) => {
    await Survey.findByIdAndUpdate(id, { isClosed: true });
    return res.status(200).json({ message: "Survey closed" });
  },

  deleteSurvey: async (res: Response, id: string) => {
    await Survey.findByIdAndDelete(id);
    return res.status(200).json({ message: "Survey deleted" });
  },
};

export default SurveyService;
