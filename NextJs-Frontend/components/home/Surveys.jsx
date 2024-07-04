import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import colors from "@/constants/colors";
import { BiPlus, BiX } from "react-icons/bi";
import StyledTable from "../shared/Table";
import { useRouter } from "next/router";
import { InputGroup } from "react-bootstrap";
import fontSizes from "@/constants/fontsizes";
import { SelectInput, TextInput, CheckboxInput } from "../shared/Input";
import { CenteredModal } from "../shared/Modal";
import { questionTypes } from "@/constants/enums";
import { AddQuestionSchema, CreateSurveySchema } from "@/schema/survey.schema";
import { validate, serperateCamelCase } from "@/utils";
import { AdminAuth } from "../auth";
import CreateReview from "../shared/Drawer";
import { ActionButton, TransparentButton, BlueButton } from "../shared/Button";
import { useCreateSurvey, useGetAdminSurveys, useLoggedInUser } from "@/hooks";
import {} from "@/hooks";

const Drawer = AdminAuth(CreateReview);

const Surveys = () => {
  const router = useRouter();

  const { data, isLoading } = useGetAdminSurveys();

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
        survey?.startDate?.split("T")[0],
        survey?.questions?.length,
        `${survey?.expectedTime} mins`,
        survey?.reward,
        survey?.participants?.length,
        `${survey?.isClosed ? "Closed" : "Active"}`,
      ]);
    }
    return [];
  }, [data]);

  return (
    <>
      <StyledTable
        title="Surveys"
        rightItem={
          <Drawer
            ButtonName="Create Survey"
            DrawerTitle="Create a new Survey"
            DrawerBody={<CreateSurvey router={router} />}
          />
        }
        labels={[
          "Title",
          "Description",
          "Start Date",
          "No Of Questions",
          "Expected Time",
          "Reward Points",
          "No Of Responses",
          "Closed/Active",
          "",
        ]}
        bodyRows={bodyRows || []}
      />
    </>
  );
};

const CreateSurvey = ({ router }) => {
  const initialForm = {
    title: "",
    description: "",
    startDate: "",
    expectedTime: "",
    reward: "",
    questions: [],
  };
  const { mutate, isPending } = useCreateSurvey();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(CreateSurveySchema, formData).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      const newFormData = {
        ...data,
        expectedTime: parseInt(data.expectedTime),
        reward: parseInt(data.reward),
      };

      mutate(newFormData, {
        onSuccess: () => {
          router.push({
            pathname: "/home",
            query: { tab: "admin", children: "surveys" },
          });
        },
      });
    });
  };

  const handleSendQuestions = (questions) => {
    setFormData((prevData) => ({ ...prevData, questions: questions }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
        {" "}
        {isOpen && (
          <AddQuestionModal
            isOpen={isOpen}
            questions={formData.questions}
            handleSendQuestions={handleSendQuestions}
            setIsOpen={setIsOpen}
          />
        )}
        <TextInput
          label="Title"
          value={formData.title}
          placeholder="Enter title"
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setErrors({ ...errors, title: "" });
          }}
          required
          errors={errors.title}
        />
        <TextInput
          label="Description"
          value={formData.description}
          placeholder="Enter description"
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setErrors({ ...errors, description: "" });
          }}
          required
          errors={errors.description}
        />
        <TextInput
          label="Start Date"
          value={formData.startDate}
          type="date"
          onChange={(e) => {
            setFormData({ ...formData, startDate: e.target.value });
            setErrors({ ...errors, startDate: "" });
          }}
          required
          errors={errors.startDate}
        />
        <TextInput
          label="Expected Time"
          value={formData.expectedTime}
          type="number"
          onChange={(e) => {
            setFormData({ ...formData, expectedTime: e.target.value });
            setErrors({ ...errors, expectedTime: "" });
          }}
          required
          errors={errors.expectedTime}
        />
        <TextInput
          label="Points to Award"
          value={formData.reward}
          type="number"
          onChange={(e) => {
            setFormData({ ...formData, reward: e.target.value });
            setErrors({ ...errors, reward: "" });
          }}
          required
          errors={errors.reward}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          {formData.questions.map((question, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25em",
                }}
              >
                <span>
                  Question {index + 1}: {question.question}
                </span>
                <span>Type: {serperateCamelCase(question.type)}</span>
                {question.type !== questionTypes.TEXT_INPUT && (
                  <span>Options: {`${question.options}`}</span>
                )}
                <span>Required: {question.isRequired ? "Yes" : "No"}</span>
              </div>
            );
          })}
        </div>
        <ActionButton label={"Add Question"} onClick={() => setIsOpen(true)} />
        {errors?.questions && (
          <Form.Text
            style={{
              color: colors.error,
            }}
          >
            {errors.questions}
          </Form.Text>
        )}
      </div>

      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <BlueButton
          style={{ width: "auto" }}
          text="Create Survey"
          onClick={handleSubmit}
          disabled={isPending}
          isLoading={isPending}
        />
      </div>
    </div>
  );
};

const AddQuestionModal = ({
  isOpen,
  questions,
  handleSendQuestions,
  setIsOpen,
}) => {
  const handleeClose = () => {
    setIsOpen(false);
  };
  const [option, setOption] = useState("");
  const [options, setOptions] = useState([]);
  const [isOptionsOpen, setOptionOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddQuestion = (question) => {
    const questionsCopy = [...questions];
    questionsCopy.push(question);
    handleSendQuestions(questionsCopy);
  };

  const initialQuestion = {
    question: "",
    type: questionTypes.MULTIPLE_CHOICE,
    options: [],
    isRequired: true,
  };

  const [question, setQuestion] = useState(initialQuestion);

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!option) return;
    setOptions([...options, option]);
    setQuestion({ ...question, options: [...options, option] });
    setOption("");
    setOptionOpen(false);
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    setQuestion({ ...question, options: newOptions });
  };

  const handleSaveAddNew = () => {
    validate(AddQuestionSchema, question).then(({ errors, data }) => {
      if (errors) {
        console.log(errors);
        setErrors(errors);
        return;
      }
      handleAddQuestion(data);
      setQuestion(initialQuestion);
      setOption("");
      setOptions([]);
    });
  };

  const handleSaveQuestion = () => {
    validate(AddQuestionSchema, question).then(({ errors, data }) => {
      if (errors) {
        setErrors(errors);
        return;
      }
      handleAddQuestion(data);
      setIsOpen(false);
    });
  };

  const onSelectChange = (e) => {
    setErrors({ ...errors, type: "" });
    setQuestion(() => ({
      ...initialQuestion,
      question: question.question,
      type: e.target.value,
    }));
    setOption("");
    setOptions([]);
  };

  return (
    <CenteredModal
      show={isOpen}
      onHide={handleeClose}
      footer={
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TransparentButton
            onClick={handleSaveAddNew}
            style={{
              width: "auto",
            }}
          >
            Save & Add New
          </TransparentButton>
          <BlueButton
            style={{
              width: "auto",
            }}
            text="Save & Close"
            onClick={handleSaveQuestion}
          />
        </div>
      }
    >
      <h5
        style={{
          marginBottom: "1em",
          color: "#101828",
          fontSize: fontSizes.xl,
        }}
      >
        Add a new question
      </h5>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}
      >
        <SelectInput
          label="Question Type"
          onChange={onSelectChange}
          options={Object.values(questionTypes)}
          lists={Object.values(questionTypes).map((type) =>
            serperateCamelCase(type)
          )}
          errors={errors.type}
        />
        <TextInput
          rows={7}
          label="Question"
          placeholder="Enter your question..."
          as="textarea"
          value={question.question}
          onChange={(e) => {
            setQuestion({ ...question, question: e.target.value });
            setErrors({ ...errors, question: "" });
          }}
          errors={errors.question}
        />
        <CheckboxInput
          value={question.isRequired}
          checked={question.isRequired}
          label="Mark as required"
          onChange={(e) => {
            setQuestion({ ...question, isRequired: e.target.checked });
            setErrors({ ...errors, isRequired: "" });
          }}
        />
        {errors?.options && (
          <Form.Text
            style={{
              color: colors.error,
            }}
          >
            {errors.options}
          </Form.Text>
        )}
        {question.type !== questionTypes.TEXT_INPUT &&
          question.options.map((option, index) => {
            return (
              <InputGroup className="mb-3" key={index}>
                <Form.Control
                  placeholder={option}
                  value={question.options[index]}
                  readOnly
                  style={{ borderRight: "none" }}
                />
                <InputGroup.Text
                  id="basic-addon1"
                  style={{
                    background: "transparent",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(), handleDeleteOption(index);
                    }}
                    style={{ background: "none" }}
                  >
                    <BiX size={20} />
                  </button>
                </InputGroup.Text>
              </InputGroup>
            );
          })}
        {isOptionsOpen && question.type !== questionTypes.TEXT_INPUT && (
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter option ..."
              value={option}
              style={{ borderRight: "none" }}
              onChange={(e) => {
                setOption(e.target.value);
              }}
            />
            <InputGroup.Text
              id="basic-addon1"
              style={{
                background: "transparent",
              }}
            >
              <Button onClick={handleAddOption} style={{ marginRight: "1em" }}>
                Add
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault(), setOptionOpen(false);
                }}
                variant="secondary"
              >
                Close
              </Button>
            </InputGroup.Text>
          </InputGroup>
        )}
        {!isOptionsOpen && question.type !== questionTypes.TEXT_INPUT && (
          <ActionButton
            label={
              <>
                <BiPlus size={20} /> Add Option
              </>
            }
            onClick={(e) => {
              e.preventDefault(), setOptionOpen(true);
            }}
          />
        )}
      </Form>
    </CenteredModal>
  );
};

export default Surveys;
