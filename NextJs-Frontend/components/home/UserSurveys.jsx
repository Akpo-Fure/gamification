import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import StyledTable from "../shared/Table";
import { useGetActiveSurveys, useLoggedInUser, useAnswerSurvey } from "@/hooks";
import { SelectInput, TextInput, CheckboxInput } from "../shared/Input";
import { questionTypes } from "@/constants/enums";
import Drawer from "../shared/Drawer";
import { BlueButton, ActionButton } from "../shared/Button";
import colors from "@/constants/colors";

const UserSurveys = () => {
  const router = useRouter();
  const user = useLoggedInUser();
  const userId = user?._id;

  const isAnswered = (survey) =>
    survey?.participants?.find(
      (participant) => participant?.participant === userId
    );

  const { data, isPending } = useGetActiveSurveys();
  const bodyRows = useMemo(() => {
    if (data) {
      return data?.data?.surveys?.map((survey) => [
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {survey?.title}
        </span>,
        survey?.description,
        survey?.questions?.length,
        `${survey?.expectedTime} mins`,
        survey?.reward,
        <Drawer
          Button={
            <ActionButton label={isAnswered(survey) ? "View" : "Answer"} />
          }
          DrawerTitle={isAnswered(survey) ? "Survey" : "Answer Survey"}
          DrawerBody={
            <AnswerSurvey
              survey={survey}
              userId={userId}
              isAnswered={isAnswered(survey)}
              router={router}
            />
          }
        />,
      ]);
    }
    return [];
  }, [data]);

  return (
    <>
      <StyledTable
        title="Surveys"
        labels={[
          "Title",
          "Description",
          "No Of Questions",
          "Expected Time",
          "Reward Points",
          "",
        ]}
        isTableLoading={isPending}
        bodyRows={bodyRows || []}
      />
    </>
  );
};

const AnswerSurvey = ({ survey, isAnswered, router, userId }) => {
  const { mutate, isPending } = useAnswerSurvey(survey?._id);
  const initialForm = survey?.questions;
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const question of form) {
      if (
        question.isRequired &&
        ((question.type === questionTypes.MULTIPLE_CHOICE &&
          (!question.answer || question.answer.length === 0)) ||
          (question.type === questionTypes.SINGLE_CHOICE && !question.answer))
      ) {
        toast.error("Please answer all required questions");
        return;
      }
    }

    mutate(
      { answers: form },
      {
        onSuccess: () => {
          router.push("/home");
        },
      }
    );
  };

  if (isAnswered) {
    const answers = survey?.participants?.find(
      (participant) => participant?.participant === userId
    )?.answers;

    return (
      <div>
        <p>Survey already answered</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            marginBottom: "2em",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
            }}
          >
            <span>Title: {survey?.title}</span>
            <span>Description: {survey?.description}</span>
            <span>Questions: {survey?.questions?.length}</span>
            <span>Expected Time: {survey?.expectedTime} mins</span>
            <span>Reward: {survey?.reward}</span>
            <span>Questions: {survey?.questions?.length}</span>
          </div>
        </div>

        {answers?.map((answer, qIndex) => (
          <div
            key={qIndex}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
            }}
          >
            <span>
              Question {qIndex + 1}:
              {survey?.questions[qIndex]?.question?.trim()?.endsWith("?")
                ? survey?.questions[qIndex]?.question
                : survey?.questions[qIndex]?.question + "?"}
            </span>
            <span>Answer: {answer?.answer}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <span>Title: {survey?.title}</span>
        <span>Description: {survey?.description}</span>
        <span>Questions: {survey?.questions?.length}</span>
        <span>Expected Time: {survey?.expectedTime} mins</span>
        <span>Reward: {survey?.reward}</span>
        <span>Questions: {survey?.questions?.length}</span>
      </div>

      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {survey?.questions?.map((question, qIndex) => (
            <div key={qIndex}>
              {question?.type === questionTypes.TEXT_INPUT && (
                <TextInput
                  rows={5}
                  label={
                    question?.question?.trim()?.endsWith("?")
                      ? question?.question
                      : question?.question + "?"
                  }
                  as="textarea"
                  required={question?.isRequired}
                  value={form[qIndex]?.answer || ""}
                  onChange={(e) => {
                    const newForm = [...form];
                    newForm[qIndex] = {
                      ...newForm[qIndex],
                      answer: e.target.value,
                    };
                    setForm(newForm);
                  }}
                />
              )}

              {question?.type === questionTypes.MULTIPLE_CHOICE && (
                <>
                  <Form.Label>
                    {question?.question?.trim()?.endsWith("?")
                      ? question?.question
                      : question?.question + "?"}{" "}
                    {question?.isRequired && (
                      <span
                        style={{
                          color: colors.error,
                        }}
                      >
                        *
                      </span>
                    )}
                  </Form.Label>
                  {question?.options?.map((option, oIndex) => (
                    <CheckboxInput
                      label={option}
                      key={`${qIndex}-${oIndex}`}
                      checked={form[qIndex]?.answer?.includes(option) || false}
                      onChange={(e) => {
                        const newForm = [...form];
                        if (e.target.checked) {
                          newForm[qIndex] = {
                            ...newForm[qIndex],
                            answer: [
                              ...(newForm[qIndex]?.answer || []),
                              option,
                            ],
                          };
                        } else {
                          newForm[qIndex] = {
                            ...newForm[qIndex],
                            answer: newForm[qIndex].answer.filter(
                              (ans) => ans !== option
                            ),
                          };
                        }
                        setForm(newForm);
                      }}
                    />
                  ))}
                </>
              )}

              {question?.type === questionTypes.SINGLE_CHOICE && (
                <>
                  <Form.Label>
                    {question?.question?.trim()?.endsWith("?")
                      ? question?.question
                      : question?.question + "?"}{" "}
                    {question?.isRequired && (
                      <span
                        style={{
                          color: colors.error,
                        }}
                      >
                        *
                      </span>
                    )}
                  </Form.Label>
                  {question?.options?.map((option, oIndex) => (
                    <CheckboxInput
                      key={`${qIndex}-${oIndex}`}
                      label={option}
                      checked={form[qIndex]?.answer === option}
                      onChange={(e) => {
                        const newForm = [...form];
                        if (e.target.checked) {
                          newForm[qIndex] = {
                            ...newForm[qIndex],
                            answer: option,
                          };
                        } else {
                          newForm[qIndex] = { ...newForm[qIndex], answer: "" };
                        }
                        setForm(newForm);
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <BlueButton
            type="submit"
            style={{ width: "auto" }}
            text="Submit"
            onClick={handleSubmit}
            disabled={isPending}
            isLoading={isPending}
          />
        </div>
      </Form>
    </div>
  );
};

export default UserSurveys;
