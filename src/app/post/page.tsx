import PostForm from './PostForm'

export const metadata = {
  title: 'Post a Listing — Furniture Gemach',
  description: 'List your furniture for the community. Giveaways from $15, sales from $25.',
}

export default function PostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a Listing</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below. Your listing goes live after payment.</p>
        </div>
        <PostForm />
      </div>
    </div>
  )
}
