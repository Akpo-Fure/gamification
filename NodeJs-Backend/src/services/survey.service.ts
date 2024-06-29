import { Response } from "express";
import UserService from "./user.service";
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
    });
    return res.status(200).json({ surveys });
  },

  getAllSurveys: async (res: Response) => {
    const surveys = await Survey.find();
    return res.status(200).json({ surveys });
  },

  getMySurveys: async (res: Response, userId: string) => {
    const surveys = await Survey.find({ createdBy: userId });
    return res.status(200).json({ surveys });
  },

  getSurveyById: async (res: Response, id: string) => {
    const survey = await Survey.findById(id);
    return res.status(200).json({ survey });
  },

  answerSurvey: async (
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

    survey.participants.push({ participant: userId, answers: dto });

    await survey.save();

    const user = await UserService.updateUser(userId, {
      $inc: { points: survey.reward, surveysAnswered: 1 },
    });

    const achievement = surveyAchievements.find(
      (achievement) => user!.surveysAnswered === achievement.value
    );

    if (achievement) {
      await Achievement.create({
        user: userId,
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
      });

      await UserService.updateUser(userId, {
        $inc: { points: achievement.points },
      });
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
