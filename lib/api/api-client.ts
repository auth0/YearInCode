import axios from 'axios'

export const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const client = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
})
