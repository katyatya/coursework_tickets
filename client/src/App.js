import React from 'react'
import Container from '@mui/material/Container'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components'
import { Home, FullPost, Registration, Login, TagPosts } from './pages'
import { useDispatch } from 'react-redux'
import { fetchAuthMe } from './redux/slices/auth'
import { Tickets } from './pages/Tickets'

function App() {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<FullPost />} />
					<Route path='/my-tickets' element={<Tickets />} />
					<Route path='/tags/:name' element={<TagPosts />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Registration />} />
				</Routes>
			</Container>
		</>
	)
}

export default App
