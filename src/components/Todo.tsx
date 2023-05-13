import { FormEvent } from 'react';

import { ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { useMutateAuth } from '../hooks/useMutateAuth';
import { useMutateTask } from '../hooks/useMutateTask';
import { useQueryTasks } from '../hooks/useQueryTasks';
import useStore from '../store';
import { TaskItem } from './TaskItem';

export const Todo = () => {
  const queryClient = useQueryClient()
  const { editedTask } = useStore()
  const updateTask = useStore(state => state.updateEditedTask)
  const { data, isLoading } = useQueryTasks()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const { logoutMutation } = useMutateAuth()
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0) {
      createTaskMutation.mutate({ title: editedTask.title })
    }
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }
  return (
    <div className='flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono'>
      <div className='flex items-center my-3'>
        <ShieldCheckIcon className='h-8 w-8 mr-3 text-blue-500 cursor-pointer' />
        <span className='text-center text-3xl font-extrabold'>TaskManager</span>
      </div>
      <ArrowRightOnRectangleIcon
        onClick={logout}
        className='h-6 w-6 my-6 text-blue-500 cursor-pointer'
      />
      <form onSubmit={submitTaskHandler}>
        <input
          type='text'
          className='border-gray-300 border mb-3 mr-3 px-3 py-2'
          placeholder='title ?'
          value={editedTask.title || ''}
          onChange={e => updateTask({ ...editedTask, title: e.target.value })}
        />
        <button
          className='disabled:opacity-40 mx-3 px-3 py-2 text-white border-indigo-600 rounded'
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className='my-5'>
          {data?.map(task => <TaskItem id={task.id} title={task.title} />)}
        </ul>
      )}
    </div>
  )
}
