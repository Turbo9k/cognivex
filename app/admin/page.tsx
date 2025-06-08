import React from 'react'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { Subscriber as SubscriberType } from '@/types/subscriber'

async function getSubscribers() {
  await connectDB()
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(subscribers)) as SubscriberType[]
}

export default async function AdminPage() {
  const subscribers = await getSubscribers()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Subscribers</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subscribed At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(subscriber.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 