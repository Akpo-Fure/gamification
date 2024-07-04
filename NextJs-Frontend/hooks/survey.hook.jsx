import API from "@/api";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const URL = "/survey/";

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  const createSurvey = async (data) => {
    const res = await API.post(`${URL}create`, data);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: createSurvey,
    onSuccess: (res) => {
      queryClient.invalidateQueries("GetSurveys");
      toast.success(res.message || "Survey created successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useGetActiveSurveys() {
  const getUsers = async () => {
    const res = await API.get(`${URL}active`);
    return res;
  };

  const query = useQuery({
    queryFn: getUsers,
    queryKey: ["GetActiveSurveys"],
  });

  return query;
}

export function useAnswerSurvey(id) {
  const queryClient = useQueryClient();

  const answerSurvey = async (data) => {
    const res = await API.patch(`${URL}answer/${id}`, data);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: answerSurvey,
    onSuccess: (res) => {
      queryClient.invalidateQueries("GetActiveSurveys");
      toast.success(res.message || "Survey answered successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}
