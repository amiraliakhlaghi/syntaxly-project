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

