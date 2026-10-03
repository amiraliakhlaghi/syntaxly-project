import Link from "next/link";
import { motion } from "framer-motion";
import { MdNoteAlt } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { SquareCode } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Logo with animation */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            },
            scale: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
          className="inline-block text-8xl text-primary mb-6"
        >
          <SquareCode className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1.5} />
        </motion.div>

        {/* Error code */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl md:text-9xl font-bold text-primary/20 dark:text-primary/10 select-none"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mt-4 text-slate-800 dark:text-slate-200"
        >
          Oops! Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-slate-600 dark:text-slate-400 text-lg"
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span className="text-sm text-slate-500 dark:text-slate-500">
            But don't worry, we've got plenty of great blogs to read!
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/blog/feed/1"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            <FiHome size={20} />
            Blog Feed
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
