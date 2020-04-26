<template>
  <v-flex
    xs12
    sm10
  >
    <v-layout
      class="step__container"
    >
      <v-flex
        xs12
        sm10
        md9
      >
        <v-layout wrap>
          <v-flex xs12 class="text-xs-left">
            <p class="font-weight-bold">
              {{ t('visibilityBoost') }}
            </p>
          </v-flex>
          <v-flex>
            <div class="step__boost-container">
              <v-checkbox
                id="visibiityBoost"
                v-model="boosted"
                color="azure"
                :label="t('visibilityBoostDescription')"
              />
            </div>
          </v-flex>
          <v-flex xs12>
            <v-divider class="step__divider" />
          </v-flex>
          <v-flex xs12>
            <v-layout justify-center>
              <v-btn
                class="base text-none azure azure--text"
                flat
                outline
                round
                @click="previousStep"
              >
                {{ t('back') }}
              </v-btn>
              <v-btn
                class="base text-none azure white--text"
                flat
                round
                @click="nextStep"
              >
                {{ t('continue') }}
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import textTranslations from '@/mixins/textTranslations';
import nextStepBtn from '@/components/setupMixins/nextStepBtn';
import previousStepBtn from '@/components/setupMixins/previousStepBtn';

export default {
  mixins: [textTranslations, nextStepBtn, previousStepBtn],
  data() {
    return {
      translationScope: 'postJob',
      boosted: false
    };
  },
  computed: {
    ...mapState('clientPostJob', ['newJob'])
  },
  mounted() {
    this.setData();
  },
  methods: {
    ...mapMutations({
      addJobAttributes: 'clientPostJob/SET_NEW_JOB_ATTRIBUTES'
    }),
    previousStep() {
      this.goToPreviousStep();
    },
    nextStep() {
      this.addJobAttributes({ attributes: { boosted: this.boosted } });
      this.goToNextStep();
    },
    setData() {
      this.boosted = this.newJob.boosted || false;
    }
  }
};
</script>
