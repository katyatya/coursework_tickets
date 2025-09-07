import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

// Получение комментариев к посту
export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId) => {
	const { data } = await axios.get(`/comments/post/${postId}`)
	return data
})

// Создание нового комментария
export const createComment = createAsyncThunk('comments/createComment', async (commentData) => {
	const { data } = await axios.post('/comments/', commentData)
	return data
})

// Обновление комментария
export const updateComment = createAsyncThunk('comments/updateComment', async ({ commentId, text }) => {
	const { data } = await axios.put(`/comments/${commentId}`, { text })
	return data
})

// Удаление комментария
export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId) => {
	await axios.delete(`/comments/${commentId}`)
	return commentId
})

const initialState = {
	comments: {
		items: [],
		status: 'loading',
	},
	createStatus: 'idle',
	updateStatus: 'idle',
	deleteStatus: 'idle',
}

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		clearComments: (state) => {
			state.comments.items = []
			state.comments.status = 'loading'
		},
		resetCreateStatus: (state) => {
			state.createStatus = 'idle'
		},
		resetUpdateStatus: (state) => {
			state.updateStatus = 'idle'
		},
		resetDeleteStatus: (state) => {
			state.deleteStatus = 'idle'
		},
	},
	extraReducers: {
		// Получение комментариев
		[fetchComments.pending]: (state) => {
			state.comments.items = []
			state.comments.status = 'loading'
		},
		[fetchComments.fulfilled]: (state, action) => {
			state.comments.items = action.payload
			state.comments.status = 'loaded'
		},
		[fetchComments.rejected]: (state) => {
			state.comments.items = []
			state.comments.status = 'error'
		},
		
		// Создание комментария
		[createComment.pending]: (state) => {
			state.createStatus = 'loading'
		},
		[createComment.fulfilled]: (state, action) => {
			// Добавляем созданный комментарий в начало списка
			state.comments.items.unshift(action.payload)
			state.createStatus = 'success'
		},
		[createComment.rejected]: (state) => {
			state.createStatus = 'error'
		},
		
		// Обновление комментария
		[updateComment.pending]: (state) => {
			state.updateStatus = 'loading'
		},
		[updateComment.fulfilled]: (state, action) => {
			const index = state.comments.items.findIndex(
				comment => comment.comment_id === action.payload.comment_id
			)
			if (index !== -1) {
				state.comments.items[index] = action.payload
			}
			state.updateStatus = 'success'
		},
		[updateComment.rejected]: (state) => {
			state.updateStatus = 'error'
		},
		
		// Удаление комментария
		[deleteComment.pending]: (state) => {
			state.deleteStatus = 'loading'
		},
		[deleteComment.fulfilled]: (state, action) => {
			// Перезагружаем комментарии после удаления
			state.deleteStatus = 'success'
		},
		[deleteComment.rejected]: (state) => {
			state.deleteStatus = 'error'
		},
	},
})

export const { clearComments, resetCreateStatus, resetUpdateStatus, resetDeleteStatus } = commentsSlice.actions
export const commentsReducer = commentsSlice.reducer
