'use client'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/50 dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Streampull</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Download YouTube videos in bulk, fast and free.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Features</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Pricing</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Documentation</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">API</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Privacy</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">Terms</a></li>
              <li><a href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white">License</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-white/10">
          &copy; {new Date().getFullYear()} Streampull. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
