import { AnimatePresence, motion } from 'motion/react'

interface Toast {
  id: string
  message: string
  type: 'join' | 'leave'
}

interface ToastProviderProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastProvider({ toasts, onDismiss }: ToastProviderProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            onAnimationComplete={() => {
              setTimeout(() => onDismiss(toast.id), 3000)
            }}
            className={`flex items-center justify-between p-4 rounded-lg shadow-lg border border-border text-sm font-medium bg-surface-2 ${
              toast.type === 'join' ? 'text-accent-green' : 'text-accent-red'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-4 text-text-secondary hover:text-text-primary focus:outline-none text-lg leading-none"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
