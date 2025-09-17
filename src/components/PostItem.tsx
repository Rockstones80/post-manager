// src/components/PostItem.tsx
import { useState } from 'react'
import type { Post, UpdatePost } from '../types/type'
import PostForm from '../components/Postform'

interface PostItemProps {
	post: Post
	onUpdate: (payload: UpdatePost) => Promise<void>
	onDelete: (id: number) => Promise<void>
}

export default function PostItem({ post, onUpdate, onDelete }: PostItemProps) {
	const [editing, setEditing] = useState<boolean>(false)
	const [deleting, setDeleting] = useState<boolean>(false)

	async function handleUpdate(values: Pick<Post, 'title' | 'body'>) {
		await onUpdate({ id: post.id, title: values.title, body: values.body })
		setEditing(false)
	}

	async function handleDelete() {
		try {
			setDeleting(true)
			await onDelete(post.id)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<li className="card">
			{editing ? (
				<div>
					<h3 className="text-lg font-semibold mb-2">Edit Post</h3>
					<PostForm
						initial={{ title: post.title, body: post.body }}
						onSubmit={handleUpdate}
						submitLabel="Update"
						onCancel={() => setEditing(false)}
					/>
				</div>
			) : (
				<div>
					<h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
					<p className="text-gray-700 mt-1">{post.body}</p>
					<div className="mt-3 flex items-center gap-2">
						<button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
						<button className="btn btn-primary" onClick={handleDelete} disabled={deleting}>
							{deleting ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				</div>
			)}
		</li>
	)
}