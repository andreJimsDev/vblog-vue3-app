<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import {useCommentStore} from "./store/comment.store.ts";
import CommentComponent from "./components/CommentComponent.vue";
import {Article} from "./@types";
import Button from "primevue/button";

const article = ref<Article>({
  title: "Lorem ipsum",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices arcu eu justo ultricies, ut mollis orci mattis. Curabitur sagittis mi non erat maximus, nec mattis sem ultrices. Aliquam dapibus, dui accumsan accumsan finibus, metus nisl lobortis nisl, sed rhoncus mauris enim id purus. In rhoncus quam nec lacus eleifend, a gravida lectus posuere. Sed aliquet scelerisque lacinia. Etiam lectus est, finibus ac rutrum ac, sollicitudin ac diam. Quisque ut orci vitae ex tincidunt pharetra. Phasellus vestibulum vel tellus sit amet congue. Vivamus sem turpis, aliquet bibendum aliquet ut, sodales at quam. Phasellus fringilla ante sed risus ultrices finibus. Cras laoreet non ante vitae hendrerit. Nam lacinia consequat quam euismod tincidunt. Suspendisse interdum viverra tincidunt. Mauris viverra, diam sit amet tristique posuere, nunc nunc congue urna, ut vestibulum odio sem sed arcu."
})

const commentStore = useCommentStore();
const comment = ref<string | null>(null);

onMounted(() => {
  commentStore.loadComments()
});

const comments = computed(() => commentStore.commentsSortedByDesc);
const totalComments = computed(() => commentStore.countTotalComments());

const addReply = (reply: string, parentOneId?: string, parentSecondId?: string) => {
  commentStore.addReply(reply, parentOneId, parentSecondId);
}

const sendComment = () => {
  if (comment.value) {
    commentStore.addComment(comment.value);
    comment.value = '';
  }
};

</script>
<template>
  <div class="flex flex-column align-items-center mt-5">
    <Card style="width: 50rem; overflow: hidden">
      <template #title>{{ article.title }}</template>
      <template #content>
        <p class="m-0">
          {{ article.content }}
        </p>
      </template>
    </Card>
    <Card style="width: 50rem; overflow: hidden">
      <template #title>Commentaires ({{ totalComments }})</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <Textarea v-model.trim="comment" size="large" rows="5" cols="50"/>
        </div>
        <Button class="mt-2" icon="pi pi-send" @click="sendComment" label="Envoyer"></Button>
      </template>
    </Card>
    <Card style="width: 50rem; overflow: hidden">
      <template #content>
        <div>
          <div v-for="comment in comments" :key="comment.id" class="comment-container">
            <div class="comment">
              <CommentComponent :comment="comment" :on-submit-reply-comment="addReply"/>
            </div>
            <div v-if="comment.replies.length > 0" class="reply-container flex flex-column-reverse">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply">
                <CommentComponent :comment="reply" :on-submit-reply-comment="addReply" :parent-id="comment.id"/>
                <div v-if="reply.replies.length > 0" class="reply-container">
                  <div v-for="secondReply in reply.replies" :key="secondReply.id" class="reply">
                    <CommentComponent :comment="secondReply" :on-submit-reply-comment="addReply" :hidden-reply="true"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.comment-container {
  margin-bottom: 20px;
}

.comment {
  border: 1px solid #ccc;
  padding: 10px;
}

.reply-container {
  margin-left: 20px;
}

.reply {
  border: 1px solid #ddd;
  padding: 10px;
}
</style>
