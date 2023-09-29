import { useMutation } from "@tanstack/vue-query";
import api from "../configs/axiosConfig";

const useCreateMessage = () =>
  useMutation({
    mutationFn: (message: { recipientId: string; content: string }) => {
      return api.post("/api/messages", message);
    },
  });

export default useCreateMessage;
