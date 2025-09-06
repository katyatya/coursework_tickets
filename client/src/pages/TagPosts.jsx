import React from 'react'
import axios from '../axios'
import { useParams } from 'react-router-dom'
import { Post, EmptyState } from '../components'
import Grid from '@mui/material/Grid'
import { useSelector } from 'react-redux'

export const TagPosts = () => {
	const userData = useSelector(state => state.auth.data)
	const { name } = useParams()
	const [posts, setPosts] = React.useState()
	const [isLoading, setLoading] = React.useState(true)

	React.useEffect(() => {
		console.log('starts')
		axios
			.get(`/posts/tags/${name}`)
			.then(res => {
				setPosts(res.data)
				setLoading(false)
			})
			.catch(err => {
				console.warn(err)
				setPosts([])
				setLoading(false)
			})
	}, [])

	// Показываем сообщение, если нет постов и загрузка завершена
	if (!isLoading && (!posts || posts.length === 0)) {
		return (
			<EmptyState
				icon="🏷️"
				title={`Нет мероприятий с тегом "${name}"`}
				description="Попробуйте выбрать другой тег или посмотрите все доступные мероприятия"
				buttonText="Посмотреть все мероприятия"
				buttonAction={() => window.location.href = '/'}
			/>
		)
	}

	return (
		<>
			<Grid xs={8} item>
				{(isLoading ? [...Array(5)] : posts).map((obj, index) =>
					isLoading ? (
						<Post key={index} isLoading={true} />
					) : (
						<Post
							id={obj.post_id}
							title={obj.title}
							imageUrl={obj.image_url}
							createdAt={obj.created_at}
							viewsCount={obj.views_count}
							tags={obj.tags}
							isAuthorized={userData?.user_id}
							ticketsLimit={obj.tickets_limit}
							ticketsAvailable={obj.tickets_available}
							ticketsBooked={obj.tickets_booked}
							isAvailable={obj.is_available}
						/>
					)
				)}
			</Grid>
		</>
	)
}
