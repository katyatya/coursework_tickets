import React from 'react'

import Grid from '@mui/material/Grid'

import { Post, EmptyState } from '../components'
import { useSelector } from 'react-redux'

import axios from '../axios'

export const Tickets = () => {
	const userData = useSelector(state => state.auth.data)
	const [tickets, setTickets] = React.useState([])
	const [isPostsLoading, setIsPostsLoading] = React.useState(false)

	const fetchTickets = async () => {
		try {
			const result = await axios.get('/posts/my-tickets/')
			setTickets(result.data)
		} catch (err) {
			console.log(err)
			setTickets([])
		}
	}
	
	React.useEffect(() => {
		setIsPostsLoading(true)
		fetchTickets().finally(() => {
			setIsPostsLoading(false)
		})
	}, [])
	
	if (!userData) {
		return null
	}

	// Показываем сообщение, если нет билетов и загрузка завершена
	if (!isPostsLoading && tickets.length === 0) {
		return (
			<EmptyState
				icon="🎫"
				title="У вас пока нет билетов"
				description="Забронируйте билеты на интересные мероприятия, и они появятся здесь"
				buttonText="Посмотреть мероприятия"
				buttonAction={() => window.location.href = '/'}
			/>
		)
	}

	return (
		<>
			<Grid container spacing={4}>
				{(isPostsLoading ? [...Array(5)] : tickets).map((obj, index) =>
					isPostsLoading ? (
						<Grid key={index} item xs={12} sm={6} md={4} lg={4}>
							<Post key={index} isLoading={true} />
						</Grid>
					) : (
						<Grid key={index} item xs={12} sm={6} md={4} lg={4}>
							<Post
								id={obj.post_id}
								title={obj.title}
								imageUrl={obj.image_url}
								createdAt={obj.created_at}
								viewsCount={obj.views_count}
								tags={obj.tags ? obj.tags : ['..']}
								isAuthorized={userData?.user_id}
								ticketsLimit={obj.tickets_limit}
								ticketsAvailable={obj.tickets_available}
								ticketsBooked={obj.tickets_booked}
								isAvailable={obj.is_available}
							/>
						</Grid>
					)
				)}
			</Grid>
		</>
	)
}
