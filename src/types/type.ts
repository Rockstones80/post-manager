export interface Post {
	id: number
	title: string
	body: string
	userId?: number
}

export interface NewPost {
	title: string
	body: string
	userId?: number
}

export type UpdatePost = Pick<Post, 'id' | 'title' | 'body'>