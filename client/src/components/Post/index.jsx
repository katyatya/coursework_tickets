import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'

import styles from './Post.module.scss'

import { PostSkeleton } from './Skeleton'
import { Navigate } from 'react-router-dom'

import axios from '../../axios'

export const Post = ({
	id,
	title,
	imageUrl,
	viewsCount,
	tags,
	children,
	isFullPost,
	isLoading,
	isAuthorized,
	ticketsLimit,
	ticketsAvailable,
	ticketsBooked,
	isAvailable,
}) => {
	const [showConfirmation, setShowConfirmation] = React.useState(false)
	const [confirmationResult, setConfirmationResult] = React.useState(null)
	const handleClick = async () => {
		// Проверяем доступность билетов
		if (!isAvailable) {
			alert('Билеты закончились!')
			return
		}
		
		try {
			await axios.post('/posts', { post_id: id })
			alert('Успешно забронировано!')
			// Обновляем страницу для отображения актуальной информации
			document.location.reload()
		} catch (err) {
			if (err.response?.data?.detail?.includes('already booked')) {
				setShowConfirmation(true)
			} else if (err.response?.data?.detail?.includes('No tickets available')) {
				alert('Билеты закончились!')
			} else {
				console.error('Ошибка:', err)
				alert('Произошла ошибка при бронировании')
			}
		}
	}
	const handleConfirmation = res => {
		setShowConfirmation(false)
		setConfirmationResult(res) // Сохраняем результат
		if (res) {
			handleDelete() // Вызываем функцию удаления, если подтверждено
		}
	}
	const handleDelete = async () => {
		try {
			console.log(id)
			await axios.delete('/posts', {
				params: { post_id: id },
			})
			console.log({ post_id: id })
			alert('Бронь отменена')
			document.location.reload()
		} catch (error) {
			console.error('Ошибка при отмене брони:', error)
		}
	}

	if (isLoading) {
		return <PostSkeleton />
	}

	return (
		<div
			className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
			onClick={() => {
				return <Navigate to={`/posts/${id}`} />
			}}
		>
			{imageUrl &&
				(isFullPost ? (
					<img
						className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
						src={imageUrl}
						alt={title}
					/>
				) : (
					<Link to={`/posts/${id}`}>
						<img
							className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
							src={imageUrl}
							alt={title}
						/>
					</Link>
				))}

			<div className={styles.wrapper}>
				<div className={styles.indention}>
					<h2
						className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
					>
						{isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
					</h2>

					<ul className={styles.tags}>
						{tags[0] !== ''
							? tags.map(name => (
									<li key={name}>
										<Link to={`/tags/${name}`}>#{name}</Link>
									</li>
							  ))
							: []}
					</ul>

					{children && <div className={styles.content}>{children}</div>}
					<ul className={styles.postDetails}>
						<li>
							<EyeIcon />
							<span>{viewsCount}</span>
						</li>
						{ticketsLimit && (
							<li className={styles.ticketsInfo}>
								<span>🎫 {ticketsAvailable}/{ticketsLimit}</span>
							</li>
						)}
					</ul>
					{isAuthorized ? (
						<button 
							onClick={handleClick} 
							className={isAvailable ? styles.button : styles.disabled}
							disabled={!isAvailable}
						>
							{isAvailable ? 'Забронировать' : 'Билеты закончились'}
						</button>
					) : (
						<button onClick={handleClick} className={styles.disabled}>
							Забронировать
						</button>
					)}
					{showConfirmation && (
						<div>
							<p>Билет уже забронирован, хотите отменить бронь?</p>
							<button onClick={() => handleConfirmation(true)}>Да</button>
							<button onClick={() => handleConfirmation(false)}>Нет</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
