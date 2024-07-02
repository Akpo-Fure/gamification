import API from "@/api";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      toast.success(res.data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}
