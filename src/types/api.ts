// src/api.ts
import axios from 'axios'
import type { NewPost, Post, UpdatePost } from '../types/type'

const client = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com',
	headers: { 'Content-Type': 'application/json' }
})

export async function fetchPosts(limit = 10): Promise<Post[]> {
	const { data } = await client.get<Post[]>(`/posts`, { params: { _limit: limit } })
	return data
}

export async function createPost(payload: NewPost): Promise<Post> {
	const { data } = await client.post<Post>('/posts', payload)
	return { ...payload, id: data.id ?? Math.floor(Math.random() * 100000), userId: payload.userId ?? 1 }
}

export async function updatePost(payload: UpdatePost): Promise<Post> {
	const { data } = await client.put<Post>(`/posts/${payload.id}`, payload)
	return { ...payload, userId: data.userId ?? 1 }
}

export async function deletePost(id: number): Promise<void> {
	await client.delete(`/posts/${id}`)
}