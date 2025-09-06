import React from 'react'

export const EmptyState = ({ 
	icon = '📋', 
	title = 'Нет данных', 
	description = 'Здесь пока ничего нет',
	buttonText = 'Перейти',
	buttonAction = () => window.location.href = '/',
	showButton = true 
}) => {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '400px',
			textAlign: 'center',
			padding: '40px 20px'
		}}>
			<div style={{
				fontSize: '64px',
				marginBottom: '20px',
				opacity: 0.3
			}}>
				{icon}
			</div>
			<h2 style={{
				fontSize: '28px',
				color: '#666',
				marginBottom: '16px',
				fontWeight: '600'
			}}>
				{title}
			</h2>
			<p style={{
				fontSize: '16px',
				color: '#888',
				marginBottom: '24px',
				maxWidth: '400px',
				lineHeight: '1.5'
			}}>
				{description}
			</p>
			{showButton && (
				<button 
					onClick={buttonAction}
					style={{
						backgroundColor: '#d047ac',
						color: 'white',
						border: 'none',
						borderRadius: '8px',
						padding: '12px 24px',
						fontSize: '16px',
						fontWeight: '600',
						cursor: 'pointer',
						transition: 'all 0.2s ease-in-out'
					}}
					onMouseOver={(e) => {
						e.target.style.backgroundColor = '#b83a9a'
						e.target.style.transform = 'translateY(-2px)'
					}}
					onMouseOut={(e) => {
						e.target.style.backgroundColor = '#d047ac'
						e.target.style.transform = 'translateY(0)'
					}}
				>
					{buttonText}
				</button>
			)}
		</div>
	)
}
