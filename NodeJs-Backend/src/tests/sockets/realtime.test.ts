import { connectDB, disconnectDB } from "../../utils/test";
import { createServer } from "node:http";
import { type Socket as ClientSocket, connect } from "socket.io-client";
import request from "supertest";
import { Server } from "socket.io";
import app from "../../app";
import { Survey, User } from "../../models";
import { io } from "../../socket/socket";
import { config } from "dotenv";
import { questionTypes } from "../../constants";
import { IQuestion } from "../../interfaces";
import { JWTService } from "../../services";
import * as argon from "argon2";

config();

let socket: ClientSocket;
let httpServer: ReturnType<typeof createServer>;
let ioServer: Server;

beforeAll(async () => {
  await connectDB();
  httpServer = createServer(app);
  httpServer.listen(Number(process.env.PORT)).on("error", () => {
    httpServer.close();
    httpServer.listen(Number(process.env.PORT));
  });
  ioServer = io;
  ioServer.attach(httpServer);
  socket = connect(process.env.API_URL!, {
    transports: ["websocket"],
  });

  await new Promise<void>((resolve) => socket.on("connect", () => resolve()));
});

afterAll(async () => {
  if (socket.connected) {
    socket.disconnect();
  }
  ioServer.close();
  httpServer.close();
  await disconnectDB();
});

describe("Should test real time updates", () => {
  let token: string;
  let user: any;
  let adminUser: any;
  let survey: any;
  const surveyDto = {
    title: "Survey",
    description: "Survey description",
    startDate: new Date(Date.now()).toDateString(),
    questions: [
      {
        type: questionTypes.MULTIPLE_CHOICE,
        question: "Question 1",
        options: ["Option 1", "Option 2", "Option 3"],
        isRequired: true,
      },
      {
        type: questionTypes.SINGLE_CHOICE,
        question: "Question 2",
        options: ["Option 1", "Option 2", "Option 3"],
        isRequired: true,
      },
    ],
    reward: 100,
    expectedTime: 30,
    isClosed: false,
    participants: [],
  };
  const answerSurveyDto = {
    ...surveyDto,
    answers: [
      ...surveyDto.questions.map((question: IQuestion) => {
        return {
          ...question,
          answer:
            question.type === questionTypes.MULTIPLE_CHOICE
              ? question.options && question.options.length > 0
                ? [question.options[0]]
                : []
              : question.options && question.options.length > 0
              ? question.options[0]
              : undefined,
        };
      }),
    ],
  };
  beforeAll(async () => {
    user = new User({
      email: "okegbeakpofurekelvin@gmail.com",
      name: "Okegbe Akpofure Kelvin",
      password: await argon.hash("password"),
      points: 100,
      referralCode: "referral",
    });

    await user.save();

    socket.emit("go-online", user._id);
    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+test@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      referrer: user._id,
      verificationToken: JWTService.sign({ referralCode: "someCode" }),
      verificationTokenExpires: new Date(Date.now() + 3600000),
      isAdmin: true,
    });

    await adminUser.save();

    survey = new Survey({
      ...surveyDto,
      createdBy: adminUser._id,
    });
    await survey.save();
  });

  it("should verify email", async () => {
    //Gets one achievement from referring a user  when admin is verified, which in turn gives 50 points, testing the points received in real time
    socket.removeAllListeners("received_points");
    socket.removeAllListeners("total_points");
    socket.removeAllListeners("new_achievement");
    const res = await request(app)
      .patch(
        `/api/auth/verifyemail/${adminUser._id}/${adminUser.verificationToken}`
      )
      .timeout(10000);
    expect(res.status).toBe(200);

    socket.on("received_points", (points) => {
      console.log({ received_points: points });
      expect(points).toBe(50);
    });
    //total points should be 150 as the user had 100 points initially
    socket.on("total_points", (totalPoints) => {
      console.log({ total_points: totalPoints });
      expect(totalPoints).toBe(150);
    });
    //new achievement should be received for referring a user
    socket.on("new_achievement", (achievement) => {
      expect(achievement.title).toBe("First Referral");
    });
  }, 10000);

  it("should login ", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "password",
      })
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  }, 10000);

  it("should answer survey", async () => {
    //Get one achievement from answering first survey which 50 points, then another achievement from answering survey which gives 100 points
    socket.removeAllListeners("new_achievement");
    socket.removeAllListeners("received_points");
    socket.removeAllListeners("total_points");
    const res = await request(app)
      .patch(`/api/survey/answer/${survey._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...answerSurveyDto,
        createdBy: adminUser._id,
      })
      .timeout(10000);
    expect(res.status).toBe(200);
    socket.on("received_points", (points) => {
      expect(points).toBe(150);
    });
    //total points should be 300 as the user had 150 points from the previous achievement
    socket.on("total_points", (totalPoints) => {
      expect(totalPoints).toBe(300);
    });
    //new achievement should be received for answering survey
    socket.on("new_achievement", (achievement) => {
      expect(achievement.title).toBe("First Survey");
    });
  }, 10000);
});
