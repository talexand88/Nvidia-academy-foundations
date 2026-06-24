# Giscus comments setup

Comments on each page use [Giscus](https://giscus.app) — a free widget that stores comments as GitHub Discussions in this repo. Reviewers sign in with their GitHub account, leave a comment, and it shows up on the page.

The HTML is already wired into 18 pages. You just need to flip two switches on GitHub and replace two placeholder values in the code.

## One-time setup (5 minutes)

### 1. Enable Discussions on the repo

1. Open <https://github.com/talexand88/nvidia-academy-foundations/settings>
2. Scroll to **Features**
3. Tick **Discussions**

### 2. Create a Discussion category for page comments

1. Open <https://github.com/talexand88/nvidia-academy-foundations/discussions/categories>
2. Click **New category**
3. **Title:** `Page comments`
4. **Discussion format:** Announcement
5. **Description:** "Per-page comments from the Visual Foundations portal."
6. Click **Create**

### 3. Install the Giscus GitHub App

1. Open <https://github.com/apps/giscus>
2. Click **Install**
3. Pick **Only select repositories**, choose `nvidia-academy-foundations`, confirm

### 4. Get your repo and category IDs

1. Open <https://giscus.app>
2. **Repository:** type `talexand88/nvidia-academy-foundations`
3. **Page ↔ Discussion mapping:** select **Discussion title contains page pathname**
4. **Discussion category:** pick **Page comments**
5. Scroll down — Giscus shows a generated `<script>` tag
6. Copy the two values:
   - `data-repo-id="..."` — that's your **repo ID**
   - `data-category-id="..."` — that's your **category ID**

### 5. Paste the IDs into the portal

Open Terminal and run from the portal folder:

```
cd "/Users/taalexander/Documents/Claude/Projects/NVIDIA Academy Design System/portal"

# Replace REAL_REPO_ID_HERE and REAL_CATEGORY_ID_HERE with the values from giscus.app
find . -name "*.html" -exec sed -i '' 's/__GISCUS_REPO_ID__/REAL_REPO_ID_HERE/g' {} +
find . -name "*.html" -exec sed -i '' 's/__GISCUS_CATEGORY_ID__/REAL_CATEGORY_ID_HERE/g' {} +
```

### 6. Push and verify

```
git add .
git commit -m "Enable Giscus comments"
git push
```

Wait a minute, open any inner page, scroll to the bottom — the comment box should appear with a "Sign in with GitHub" button.

## What gets a Comments block

These pages have it: all 8 guides (Typography, Color, Frames & cards, Spacing, Logos, Imagery, Code & CLI, Charts), all 3 asset detail pages (Icons, Logos, Templates), all 3 tool pages (Pattern tree, Screenshot review, PowerPoint validator), and the 4 hubs (Content, Assets, Toolkit, Case studies). Total: 18 pages.

The home page, search results, and Motion (v2 placeholder) don't have comments — they're navigation, not content to review.

## Removing comments later

If you ever want to remove the comments block from a page, delete the `<section class="comments-block">` block (everything from that opening tag to its `</section>`). The CSS in `shared/tokens.css` can be left alone — it's only ~30 lines and won't cause issues if unused.
