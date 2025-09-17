// src/components/PostList.tsx
import type { Post, UpdatePost } from '../types/type'
import PostItem from './PostItem'

interface PostListProps {
	posts: Post[]
	onUpdate: (payload: UpdatePost) => Promise<void>
	onDelete: (id: number) => Promise<void>
}

export default function PostList({ posts, onUpdate, onDelete }: PostListProps) {
	if (posts.length === 0) {
		return <p className="text-gray-600">No posts found.</p>
	}
	return (
		<ul className="grid gap-4">
			{posts.map((p) => (
				<PostItem key={p.id} post={p} onUpdate={onUpdate} onDelete={onDelete} />
			))}
		</ul>
	)
}