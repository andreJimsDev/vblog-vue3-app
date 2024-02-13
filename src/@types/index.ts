export interface Article {
    title: string;
    content: string;
}


export interface Comment {
    id: string;
    value: string;
    replies: Comment[];
    commentedAt: Date
}