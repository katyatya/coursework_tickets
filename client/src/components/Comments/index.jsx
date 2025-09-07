import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
	fetchComments, 
	createComment, 
	updateComment, 
	deleteComment,
	clearComments,
	resetCreateStatus,
	resetUpdateStatus,
	resetDeleteStatus
} from '../../redux/slices/comments'
import { selectIsAuth } from '../../redux/slices/auth'
import styles from './Comments.module.scss'

export const Comments = ({ postId }) => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const { comments, createStatus, updateStatus, deleteStatus } = useSelector(state => state.comments)
	
	const [newComment, setNewComment] = useState('')
	const [editingComment, setEditingComment] = useState(null)
	const [editText, setEditText] = useState('')

	useEffect(() => {
		if (postId) {
			dispatch(fetchComments(postId))
		}
		return () => {
			dispatch(clearComments())
		}
	}, [postId, dispatch])


	useEffect(() => {
		if (createStatus === 'success') {
			setNewComment('')
			dispatch(resetCreateStatus())
		}
	}, [createStatus, dispatch])

	useEffect(() => {
		if (updateStatus === 'success') {
			setEditingComment(null)
			setEditText('')
			dispatch(resetUpdateStatus())
		}
	}, [updateStatus, dispatch])

	useEffect(() => {
		if (deleteStatus === 'success') {
			dispatch(resetDeleteStatus())
			// Перезагружаем комментарии после успешного удаления
			dispatch(fetchComments(postId))
		}
	}, [deleteStatus, dispatch, postId])

	const handleSubmitComment = (e) => {
		e.preventDefault()
		if (newComment.trim() && isAuth) {
			dispatch(createComment({ text: newComment, post_id: postId }))
		}
	}

	const handleEditComment = (comment) => {
		setEditingComment(comment.comment_id)
		setEditText(comment.text)
	}

	const handleUpdateComment = (e) => {
		e.preventDefault()
		if (editText.trim()) {
			dispatch(updateComment({ commentId: editingComment, text: editText }))
		}
	}

	const handleDeleteComment = (commentId) => {
		if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
			dispatch(deleteComment(commentId))
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className={styles.commentsContainer}>
			<h3 className={styles.commentsTitle}>Комментарии ({comments.items.length})</h3>
			
			{/* Форма добавления комментария */}
			{isAuth ? (
				<form onSubmit={handleSubmitComment} className={styles.commentForm}>
					<textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Напишите ваш комментарий..."
						className={styles.commentInput}
						rows={3}
					/>
					<button 
						type="submit" 
						className={styles.submitButton}
						disabled={!newComment.trim() || createStatus === 'loading'}
					>
						{createStatus === 'loading' ? 'Отправка...' : 'Отправить'}
					</button>
				</form>
			) : (
				<div className={styles.loginPrompt}>
					<p>Войдите в аккаунт, чтобы оставить комментарий</p>
				</div>
			)}

			{/* Список комментариев */}
			<div className={styles.commentsList}>
				{comments.status === 'loading' ? (
					<div className={styles.loading}>Загрузка комментариев...</div>
				) : comments.status === 'error' ? (
					<div className={styles.error}>Ошибка загрузки комментариев</div>
				) : comments.items.length === 0 ? (
					<div className={styles.empty}>Пока нет комментариев. Будьте первым!</div>
				) : (
					comments.items.map((comment) => (
						<div key={comment.comment_id} className={styles.commentItem}>
							<div className={styles.commentHeader}>
								<div className={styles.userInfo}>
									{comment.user?.avatar_url && comment.user.avatar_url !== null ? (
										<img 
											src={comment.user.avatar_url} 
											alt={comment.user.full_name || 'User'}
											className={styles.avatar}
										/>
									) : (
										<div className={styles.defaultAvatar}>
											{(comment.user?.full_name || 'U').charAt(0).toUpperCase()}
										</div>
									)}
									<div className={styles.userDetails}>
										<span className={styles.userName}>{comment.user?.full_name || 'Анонимный пользователь'}</span>
										<span className={styles.commentDate}>
											{formatDate(comment.created_at)}
										</span>
									</div>
								</div>
								
								{/* Кнопки редактирования/удаления (только для автора) */}
								{isAuth && comment.user_id && (() => {
									try {
										const token = localStorage.getItem('token')
										if (!token) return false
										const decoded = JSON.parse(atob(token.split('.')[1]))
										return comment.user_id === decoded.user_id
									} catch {
										return false
									}
								})() && (
									<div className={styles.commentActions}>
										<button 
											onClick={() => handleEditComment(comment)}
											className={styles.editButton}
										>
											Редактировать
										</button>
										<button 
											onClick={() => handleDeleteComment(comment.comment_id)}
											className={styles.deleteButton}
											disabled={deleteStatus === 'loading'}
										>
											Удалить
										</button>
									</div>
								)}
							</div>
							
							{editingComment === comment.comment_id ? (
								<form onSubmit={handleUpdateComment} className={styles.editForm}>
									<textarea
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className={styles.editInput}
										rows={3}
									/>
									<div className={styles.editActions}>
										<button 
											type="submit" 
											className={styles.saveButton}
											disabled={!editText.trim() || updateStatus === 'loading'}
										>
											{updateStatus === 'loading' ? 'Сохранение...' : 'Сохранить'}
										</button>
										<button 
											type="button" 
											onClick={() => {
												setEditingComment(null)
												setEditText('')
											}}
											className={styles.cancelButton}
										>
											Отмена
										</button>
									</div>
								</form>
							) : (
								<div className={styles.commentText}>{comment.text}</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	)
}
