<template>
  <v-flex
    xs12
    sm10
    md9
  >
    <v-form>
      <v-layout
        column
        class="text-xs-left"
      >
        <v-flex>
          <label
            class="base-input-label"
          >
            {{ t('selectPreviousJob') }}
            <v-autocomplete
              v-model="choosenJob"
              v-validate="'required'"
              :data-vv-name="t('selectPreviousJob')"
              :error-messages="errors.collect(t('selectPreviousJob'))"
              :items="allJobs"
              item-text="title"
              return-object
              append-icon="keyboard_arrow_down"
              class="base-input mt-2"
              solo
            />
          </label>
        </v-flex>
        <v-flex class="mt-3">
          <v-layout justify-center>
            <v-btn
              round
              class="azure white--text px-5 text-none base"
              @click="saveData"
            >
              {{ t('continue') }}
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-form>
  </v-flex>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import textTranslations from '@/mixins/textTranslations';

export default {
  mixins: [textTranslations],
  data() {
    return {
      translationScope: 'postJob',
      choosenJob: null
    };
  },
  computed: {
    ...mapState('clientPostJob', ['jobs']),
    allJobs() {
      return this.jobs.map(job => ({ title: job.title, id: job.id }));
    }
  },
  methods: {
    ...mapMutations('clientPostJob', ['USE_TEMPLATE']),
    async saveData() {
      const isValid = await this.$validator.validate();
      if (!isValid) return;

      const { requirements, ...attributes } = this.jobs.find(item => item.id === this.choosenJob.id);

      const expertise = Object.assign({}, { name: attributes.expertise.name, id: attributes.expertise.id });
      const expertiseCategory = Object.assign(
        {}, { name: attributes.expertise.category.name, id: attributes.expertise.category.id }
      );

      delete attributes.expertise;
      attributes.expertise = expertise;
      attributes.expertiseCategory = expertiseCategory;

      this.USE_TEMPLATE({ requirements, ...attributes });
      this.$emit('use-template');
    }
  }
};
</script>
