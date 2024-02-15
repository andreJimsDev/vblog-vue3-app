import {defineStore} from 'pinia';
import {Comment} from "../@types";
import {uuid} from 'vue3-uuid';

interface CommentState {
    comments: Comment[];
}

export const useCommentStore = defineStore({
    id: 'comments',
    state: (): CommentState => ({
        comments: [],
    }),
    getters: {
        commentsSortedByDesc: (state): Comment[] => {
            if (state.comments) {
                // Create a copy of the comments array to avoid modifying the original
                const commentsCopy = [...state.comments];
                return commentsCopy.sort((a, b) => new Date(b.commentedAt).getTime() - new Date(a.commentedAt).getTime());
            } else {
                return [];
            }
        },
    },
    actions: {
        loadComments() {
            const storedComments = localStorage.getItem('comments');
            if (storedComments) {
                this.comments = JSON.parse(storedComments);
            }
        },
        addComment(value: string) {
            this.comments.push({
                id: uuid.v4(),
                value,
                commentedAt: new Date(),
                replies: []
            });
            this.saveCommentsInDB();
        },
        addReply(reply: string, parentOneIds?: string[], parentSecondId?: string) {
            let comment = undefined;
            if (parentOneIds && parentOneIds.length && parentSecondId) {
                let commentList = this.comments;
                for (const id of parentOneIds) {
                    comment = commentList.find((c) => c.id === id);
                    if (comment) {
                        commentList = comment.replies;
                    }
                }
                if (parentSecondId && comment) {
                    const result = comment.replies.find((c) => c.id === parentSecondId);
                    if (result)
                        comment = result;
                }
                if (comment) {
                    if (!comment.replies) {
                        comment.replies = [];
                    }
                    comment.replies.push({
                        id: uuid.v4(),
                        value: reply,
                        commentedAt: new Date(),
                        replies: []
                    });
                }
            }
            this.saveCommentsInDB();
        },
        saveCommentsInDB() {
            localStorage.setItem('comments', JSON.stringify(this.comments));
        },
        countTotalComments(): number {
            let count = 0;

            this.comments.forEach(comment => {
                count += this.countComments(comment);
            });

            return count;
        },
        countComments(comment: Comment): number {
            let count = 1;
            if (comment.replies && comment.replies.length > 0) {
                comment.replies.forEach(reply => {
                    count += this.countComments(reply);
                });
            }
            return count;
        }
    },
});
