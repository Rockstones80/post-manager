// src/components/PostForm.tsx
import { useState, useEffect } from 'react'
import type { NewPost, Post } from '../types/type'

interface PostFormProps {
	onSubmit: (values: NewPost) => Promise<void> | void
	initial?: Pick<Post, 'title' | 'body'> | null
	submitLabel?: string
	onCancel?: () => void
}

export default function PostForm({ onSubmit, initial, submitLabel = 'Create', onCancel }: PostFormProps) {
	const [title, setTitle] = useState<string>(initial?.title ?? '')
	const [body, setBody] = useState<string>(initial?.body ?? '')
	const [submitting, setSubmitting] = useState<boolean>(false)

	useEffect(() => {
		setTitle(initial?.title ?? '')
		setBody(initial?.body ?? '')
	}, [initial])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!title.trim() || !body.trim()) return
		try {
			setSubmitting(true)
			await onSubmit({ title: title.trim(), body: body.trim(), userId: 1 })
			if (!initial) {
				setTitle('')
				setBody('')
			}
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
				<input
					data-testid="title-input"
					className="input"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Post title"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
				<textarea
					data-testid="body-input"
					className="input min-h-[100px]"
					value={body}
					onChange={(e) => setBody(e.target.value)}
					placeholder="Write something..."
				/>
			</div>
			<div className="flex items-center gap-2">
				<button type="submit" className="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : submitLabel}
				</button>
				{onCancel ? (
					<button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
						Cancel
					</button>
				) : null}
			</div>
		</form>
	)
}