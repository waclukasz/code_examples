<template>
  <v-flex
    xs12
    sm10
    md9
  >
    <v-form>
      <v-layout class="text-xs-left" column>
        <v-flex>
          <label
            for="expertiseCategory"
            class="base-input-label"
          >
            {{ t('jobCategory') }}
          </label>
          <v-autocomplete
            id="expertiseCategory"
            v-model="form.expertiseCategory"
            v-validate="'required'"
            :data-vv-name="t('jobCategory')"
            :items="expertiseCategories"
            :error-messages="errors.first(t('jobCategory'))"
            item-text="name"
            return-object
            class="base-input mt-1"
            solo
          />
        </v-flex>
        <v-flex>
          <label
            for="expertise"
            class="base-input-label"
          >
            {{ t('expertise') }}
          </label>
          <v-autocomplete
            id="expertise"
            v-model="form.expertise"
            v-validate="form.expertiseCategory ? 'required' : ''"
            :disabled="!form.expertiseCategory"
            :data-vv-name="t('expertise')"
            :items="expertises"
            :error-messages="errors.collect(t('expertise'))"
            item-text="name"
            item-value="object"
            return-object
            class="base-input mt-1"
            solo
          />
        </v-flex>
        <v-flex>
          <v-layout align-center>
            <v-flex>
              <label
                class="base-input-label"
              >
                {{ t('jobTitle') }}
                <v-text-field
                  v-model="form.title"
                  v-validate="'required'"
                  :error-messages="errors.collect(t('jobTitle'))"
                  :data-vv-name="t('jobTitle')"
                  class="base-input mt-2"
                  solo
                  required
                />
              </label>
            </v-flex>
            <v-flex shrink>
              <v-btn depressed fab class="xsmall step__btn-box">
                <span class="step__btn--mark" />
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout align-center>
            <v-flex>
              <label class="base-input-label">
                {{ t('jobDescription') }}
                <v-textarea
                  v-model="form.description"
                  v-validate="'required'"
                  :error-messages="errors.collect(t('jobDescription'))"
                  :data-vv-name="t('jobDescription')"
                  class="base-input mt-2"
                  solo
                  required
                />
              </label>
            </v-flex>
            <v-flex shrink>
              <v-btn depressed fab class="xsmall step__btn-box">
                <span class="step__btn--mark" />
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex text-xs-left>
          <v-layout align-center>
            <v-flex>
              <v-btn
                depressed
                class="ml-0 step__add-portfolio uppy-uploader"
                @click="showUploadDashboard = !showUploadDashboard"
              >
                <v-icon class="white--text">
                  add
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex text-xs-left>
              <p class="mb-0 ml-1 font-weight-bold">
                {{ t('attachFiles') }}
              </p>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex class="overflow-hidden">
          <v-fade-transition
            leave-absolute
          >
            <UppyFilesUploader
              v-if="showUploadDashboard"
              upload-id="job-files-attach"
              @upload-success="addFileData"
            />
          </v-fade-transition>
        </v-flex>
        <v-flex class="mt-5">
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
import {
  mapState, mapMutations, mapGetters, mapActions
} from 'vuex';
import textTranslations from '@/mixins/textTranslations';
import UppyFilesUploader from '@/components/shared/UppyFilesUploader';


export default {
  components: { UppyFilesUploader },
  mixins: [textTranslations],
  data() {
    return {
      translationScope: 'postJob',
      showUploadDashboard: false,
      form: {
        expertise: null,
        expertiseCategory: null,
        title: null,
        description: null,
        attachments: []
      }
    };
  },
  computed: {
    ...mapState('clientPostJob', ['jobCategories', 'newJob']),
    ...mapState({
      expertiseCategories: state => state.staticData.expertiseCategories
    }),
    ...mapGetters('staticData', ['expertises']),
    expertiseCategory() {
      return this.form.expertiseCategory;
    }
  },
  watch: {
    expertiseCategory({ id }) {
      this.fetchExpertises(id);
    }
  },
  mounted() {
    this.fetchExpertiseCategories();
    if (this.newJob.expertiseCategory) {
      this.fetchExpertises(this.newJob.expertiseCategory.id);
    }
    this.setData();
  },
  methods: {
    ...mapMutations({
      updateAttachments: 'clientPostJob/UPDATE_ATTACHMENTS',
      addJobAttributes: 'clientPostJob/SET_NEW_JOB_ATTRIBUTES'
    }),
    ...mapActions({
      fetchExpertises: 'staticData/fetchExpertises',
      fetchExpertiseCategories: 'staticData/fetchExpertiseCategories'
    }),
    async saveData() {
      const isValid = await this.$validator.validate();
      if (!isValid) return;

      delete this.form.attachments;
      this.addJobAttributes({ attributes: this.form });
      this.$emit('next-step', true);
    },
    setData() {
      const { newJob, form } = this;
      Object.keys(form).forEach(attr => {
        form[attr] = newJob[attr] || null;
      });
    },
    addFileData(fileData) {
      this.updateAttachments(JSON.stringify(fileData));
    }
  }
};
</script>
