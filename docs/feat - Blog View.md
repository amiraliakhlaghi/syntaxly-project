Steps : 
- create table
- use cookies for guest user
- create server action fc 
- use in front-end

requirement:
- Store views by registered users
- Store views by guest users
- Show the number of views for each blog
- Prevent duplicate views

---

Purpose of the `BlogView` table:
This table stores a view by a user (guest or registered) for the given article/blog.

Purpose of the `BlogViewCount` table:
If we want to show the number of views for a blog, we would have to group the BlogView table by that blog’s Id and then perform a count. Due to the high volume of data, this has a very high processing time.

Now the question arises: if there is a table like BlogViewCount that keeps the blogId and the number of views for each one, and to show the number of views per blog we no longer need to group and then count, why do we need to store userId in the BlogView table, or in general, why do we need the BlogView table at all?
Well, userId helps us prevent duplicate views.

---

`increment-view.ts` server action function:
- Purpose: overall, this function records a view and increments the view count for each blog.
- Receives `blogId` as an argument.
- First, using `auth()` and `cookies()`, it gets the cookies and session.
- Then we get `userId` from the session and `visitorId` from the cookie.
- We check whether `visitorId` or `userId` is missing; if so, it sets a cookie.
- Then, in the `BlogView` table, we check whether a row exists with this `userId` or `visitorId` and `blogId`.
- Inserts a row into `BlogView` and increments the view count in `BlogViewCount` by one.

---

- **Race condition / duplicate requests:**  
    It only prevents duplicate calls within the same mounted component instance. True protection against duplicate views must be enforced on the server. On server action, `findFirst` followed by `create` is still a check-then-act pattern, so two concurrent requests can both see no existing view and both increment the count. To make it race-safe, add a unique constraint on `BlogView` (for example, on `(blogId, userId)` and `(blogId, visitorId)`) and handle the unique-violation error as `counted: false`, or use an atomic insert/upsert that relies on that constraint.
    
- **`useRef`:**  
    `useRef` lets us keep a mutable value between renders without causing a re-render. We use it as a one-time guard so that the effect does not call `incrementBlogView` more than once in the same mount. However, it resets on refresh/remount, and it is local to each component instance, so it cannot prevent a new request after a refresh. It also does not replace server-side deduplication. If `blogId` can change without remounting the component, the guard should be keyed to `blogId`.
    
- **`useEffect`:**  
    Here it runs on mount and when `blogId` or `ReqTracker` changes. It is used to trigger the server action after the component has rendered. The `setViewCount` call inside `.then()` is what causes a new render to display the updated count.

---

I initially used this component inside `BlogCard.tsx`. Since `BlogCard` is rendered inside a `map` for each blog displayed in the list, and `BlogViewCounter` is a client component whose `useEffect` runs after it mounts/hydrates, a view was being recorded for every rendered card even before the user clicked on that blog. That is why I moved this component to `app/blog/details/[id]/page.tsx`, so it only mounts on the actual blog details page.