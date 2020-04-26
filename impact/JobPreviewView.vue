<template>
  <v-flex
    xs12
    sm11
    md10
    lg9
    class="job-post__summary-container"
  >
    <v-layout
      wrap
      class="base-card pa-0 overflow-hidden job-post__summary-content"
    >
      <v-flex
        class="toolbar-highlight job-post__toolbar"
      >
        <v-layout
          align-center
          justify-space-between
        >
          <v-flex shrink>
            <v-layout
              align-center
              justify-start
              wrap
            >
              <Avatar
                :name="$auth.user.activeProfile.name"
                :img="logoImg"
                size="xxs"
                class="mr-2"
              />
              <v-flex shrink>
                <h4 class="d-inline">
                  {{ $auth.user.activeProfile.name }}
                </h4>
                <p class="ma-0 d-inline text-capitalize">
                  {{ $auth.user.activeProfile.clientType }},
                </p>
                <p class="ma-0 d-inline">
                  {{ impactAreas }}
                </p>
              </v-flex>
              <v-flex shrink class="ml-3">
                <v-flex class="align-center d-inline">
                  <v-icon size="20" color="aqua">
                    location_on
                  </v-icon>
                  <p class="ma-0 ml-1 d-inline">
                    {{ $auth.user.activeProfile.location }}
                  </p>
                </v-flex>
                <v-flex class="align-center d-inline ml-1">
                  <v-icon size="20" color="aqua">
                    star_border
                  </v-icon>
                  <p class="ma-0 ml-1 d-inline">
                    {{ `${$auth.user.activeProfile.rating }%`|| 'Not Specified' }}
                  </p>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        xs12
        class="job-post__summary-content pt-0"
      >
        <v-layout wrap>
          <v-flex
            xs12
          >
            <v-layout
              align-center
              class="job-post__edit-box"
            >
              <h2
                v-if="!isTitleEdited"
                class="job-post__header job-post__header--final"
              >
                {{ title }}
              </h2>
              <v-flex
                v-if="isTitleEdited"
              >
                <v-text-field
                  v-model="title"
                  class="base-input mt-3"
                  solo
                  flat
                />
              </v-flex>
              <ButtonEdit
                :is-edited="isTitleEdited"
                @click.native="editTitle"
              />
            </v-layout>
          </v-flex>
          <v-flex xs12 text-xs-left>
            <v-chip
              v-if="newJob.budget"
              class="base font-weight-bold"
            >
              {{ budget }}
            </v-chip>
            <v-chip
              v-if="deadline"
              class="base font-weight-bold"
            >
              {{ deadlineTitle }}
            </v-chip>
            <v-chip
              v-if="expertiseLevel"
              class="base text-capitalize font-weight-bold"
            >
              {{ expertiseLevel }}
            </v-chip>
          </v-flex>
          <v-flex
            xs12
            class="mt-3"
          >
            <v-layout>
              <v-flex
                v-if="!isDescriptionEdited"
                class="job-post__summary-description"
              >
                <p class="ma-0 text-xs-left">
                  {{ description }}
                </p>
              </v-flex>
              <v-flex
                v-else
              >
                <v-textarea
                  v-model="description"
                  v-validate="'required'"
                  :error-messages="errors.collect(t('jobDescription'))"
                  :data-vv-name="t('jobDescription')"
                  class="base-input"
                  solo
                  required
                />
              </v-flex>
              <ButtonEdit
                :is-edited="isDescriptionEdited"
                @click.native="editDescription"
              />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      justify-center
      class="mt-3"
    >
      <v-btn
        round
        flat
        outline
        class="base text-none azure azure--text"
        @click="goToPreviousStep"
      >
        {{ t('back') }}
      </v-btn>
      <v-btn
        round
        flat
        :loading="loading"
        class="base text-none azure white--text"
        @click="createNewJobOffer"
      >
        {{ t('continue') }}
      </v-btn>
    </v-layout>
  </v-flex>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import nextStepBtn from '@/components/setupMixins/nextStepBtn';
import previousStepBtn from '@/components/setupMixins/previousStepBtn';
import textTranslations from '@/mixins/textTranslations';
import Avatar from '@/components/shared/AvatarComponent';
import ButtonEdit from '@/components/shared/ButtonEdit';
import { formatTime } from '@/services/times';
import profileLogo from '@/mixins/profileLogo';

export default {
  components: { Avatar, ButtonEdit },
  mixins: [textTranslations, nextStepBtn, previousStepBtn, profileLogo],
  data() {
    return {
      translationScope: 'postJob',
      isTitleEdited: false,
      isDescriptionEdited: false,
      title: '',
      description: '',
      loading: false
    };
  },
  computed: {
    ...mapState('clientPostJob', ['newJob']),
    impactAreas() {
      return this.$auth.user.activeProfile.impactAreas.map(area => area.name).join(', ');
    },
    budget() {
      const label = this.newJob.jobType === 'fixed' ? this.t('fixedPrice') : this.t('perHour');
      return `${label} - $${this.newJob.budget || 0}`;
    },
    deadlineTitle() {
      const { jobType } = this.newJob;
      const label = jobType === 'hourly' ? this.t('projectDuration') : this.t('projectdeadlineAt');
      return `${label} - ${this.deadline}`;
    },
    deadline() {
      const { jobType } = this.newJob;
      if (jobType === 'hourly') {
        return this.newJob.projectLength
          ? this.t(this.newJob.projectLength, null, 'projectLength')
          : null;
      }
      return this.newJob.projectDeadlineAt ? formatTime(this.newJob.projectDeadlineAt) : null;
    },
    logoImg() {
      return this.logo ? this.logo.xs : null;
    },
    expertiseLevel() {
      return this.newJob.expertiseLevel
        ? this.t(this.newJob.expertiseLevel, null, 'freelancersLevels')
        : null;
    }
  },
  mounted() {
    this.title = this.newJob.title;
    this.description = this.newJob.description;
  },
  methods: {
    ...mapActions('clientPostJob', ['createJobOffer']),
    ...mapMutations('clientPostJob', ['SET_NEW_JOB_ATTRIBUTES']),
    editTitle() {
      this.isTitleEdited = !this.isTitleEdited;
      this.SET_NEW_JOB_ATTRIBUTES({ attributes: { title: this.title } });
    },
    editDescription() {
      this.isDescriptionEdited = !this.isDescriptionEdited;
      this.SET_NEW_JOB_ATTRIBUTES({ attributes: { description: this.description } });
    },
    async createNewJobOffer() {
      this.loading = true;
      try {
        await this.createJobOffer();
        this.$router.push(this.localePath('client-dashboard'));
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
