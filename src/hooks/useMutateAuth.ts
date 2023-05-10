import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import useStore from '../store';
import { Credential } from '../types';
import { useError } from './useError';

export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const { switchErrorHandling } = useError()
  const loginMutation = useMutation(
    async (user: Credential) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, user),
    {
      onSuccess: () => {
        navigate('/todo')
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message)
        } else {
          switchErrorHandling(error.response.data)
        }
      },
    }
  )
  const registerMutation = useMutation(
    async (user: Credential) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, user),
    {
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message)
        } else {
          switchErrorHandling(error.response.data)
        }
      },
    }
  )

  const logoutMutation = useMutation(
    async () => await axios.post(`${process.env.REACT_APP_API_URL}/logout`),
    {
      onSuccess: () => {
        resetEditedTask()
        navigate('/')
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message)
        } else {
          switchErrorHandling(error.response.data)
        }
      },
    }
  )

  return { loginMutation, registerMutation, logoutMutation }
}
