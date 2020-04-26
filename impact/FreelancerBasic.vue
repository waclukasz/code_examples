<template>
  <v-layout
    row
    fluid
    justify-center
    class="step__box"
  >
    <v-flex xs12 sm11 md9 text-xs-left>
      <form
        novalidate
        @submit.prevent="nextStep"
      >
        <v-layout
          class="step__container"
          row
          justify-center
        >
          <v-flex xs12 md10 lg9>
            <v-layout justify-center wrap>
              <v-flex shrink text-xs-left>
                <UppyImageUploader
                  upload-id="freelancer-profile-image-upload"
                  :choose-file-label="t('uploadProfilePicture', null, 'profile')"
                  size="lg"
                  :centered="true"
                  :current-img="profileLogo"
                  @handle-image-uppload="handleImageUppload"
                >
                  <v-btn
                    type="button"
                    fab
                    depressed
                    large
                    class="step__pf-img-btn ma-0"
                  >
                    <v-icon>
                      add
                    </v-icon>
                  </v-btn>
                </UppyImageUploader>
                <h2 class="step__upload-picture-title">
                  {{ t('uploadProfilePicture') }}
                </h2>
              </v-flex>
              <v-flex xs12 mt-4 justify-center>
                <v-layout wrap justify-center>
                  <v-flex xs10>
                    <ExpertisesInput
                      v-model="expertiseId"
                      v-validate="'required'"
                      :name="t('expertise')"
                      :error="errors.first(t('expertise'))"
                      data-vv-validate-on="input"
                    />
                  </v-flex>
                  <v-flex xs10>
                    <label
                      for="profileTitle"
                      class="base-input-label"
                    >
                      {{ t('profileTitle') }}
                    </label>
                    <v-layout row align-baseline>
                      <v-text-field
                        v-model="form.title"
                        v-validate="'required|min:2'"
                        :error-messages="errors.collect(t('profileTitle'))"
                        :data-vv-name="t('profileTitle')"
                        class="base-input mt-2"
                        solo
                        required
                      />
                      <v-flex shrink>
                        <v-btn depressed fab class="xsmall step__btn-box">
                          <span class="step__btn--mark" />
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex my-3 xs10>
                    <v-divider class="step__divider" />
                  </v-flex>
                  <LanguageLevelsInput
                    v-model="englishProficiency"
                    v-validate="'required'"
                    language-name="English"
                    :name="t('languageProficiencyInput')"
                    :error="errors.first(t('languageProficiencyInput'))"
                    data-vv-validate-on="input"
                  />
                  <LocationsInput
                    v-model="location"
                    v-validate="'required'"
                    :name="t('location')"
                    :error="errors.first(t('location'))"
                    data-vv-validate-on="input"
                  />
                  <TimezonesInput
                    v-if="location"
                    v-model="form.timezone"
                    v-validate="'required'"
                    :name="t('timezone')"
                    :error="errors.first(t('timezone'))"
                    :country-id="location"
                    data-vv-validate-on="input"
                  />
                  <v-flex my-3 xs10>
                    <v-divider class="step__divider" />
                  </v-flex>

                  <v-flex xs10>
                    <v-layout row wrap justify-space-between>
                      <v-flex xs12 sm5>
                        <v-layout align-center>
                          <v-flex
                            :shrink="$vuetify.breakpoint.smAndUp"
                          >
                            <label
                              for="hourlyRate"
                              class="base-input-label"
                            >
                              {{ t('hourlyRate') }}
                            </label>
                            <v-text-field
                              v-model="form.hourlyRate"
                              v-validate="'required|numeric'"
                              placeholder="0"
                              :error-messages="errors.collect(t('hourlyRate'))"
                              :data-vv-name="t('hourlyRate')"
                              class="base-input mt-2 step__input--hour"
                              required
                              prefix="$"
                              solo
                            />
                          </v-flex>
                          <v-flex ml-2 shrink>
                            <span>USD</span>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-spacer />
                      <v-flex xs12 sm6>
                        <v-layout align-center justify-end>
                          <v-flex
                            :shrink="$vuetify.breakpoint.smAndUp"
                          >
                            <label
                              for="availability"
                              class="base-input-label"
                            >
                              {{ t('availability') }}
                            </label>
                            <v-text-field
                              v-model="form.availability"
                              v-validate="'required|numeric'"
                              placeholder="0"
                              :error-messages="errors.collect(t('availability'))"
                              :data-vv-name="t('availability')"
                              class="base-input mt-2 step__input--availability"
                              required
                              solo
                            />
                          </v-flex>
                          <v-flex ml-2 shrink>
                            <span class="no-wrap">{{ t('hoursPerWeek') }}</span>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex shrink mt-4 mb-2>
                    <v-btn
                      round
                      type="submit"
                      :loading="loading"
                      class="azure white--text px-5 text-none base"
                    >
                      {{ t('saveNgo') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex';
import serializeData from '@/mixins/serializeData';
import textTranslations from '@/mixins/textTranslations';
import nextStepBtn from '@/components/setupMixins/nextStepBtn';
import saveProfileImageData from '@/components/setupMixins/saveProfileImageData';
import UppyImageUploader from '@/components/shared/UppyImageUploader';
import LanguageLevelsInput from '@/components/shared/inputs/LanguageLevelsInput';
import TimezonesInput from '@/components/shared/inputs/TimezonesInput';
import ExpertisesInput from '@/components/shared/inputs/ExpertisesInput';
import LocationsInput from '@/components/shared/inputs/LocationsInput';
import profileLogoMixin from '@/mixins/profileLogo';

export default {
  components: {
    UppyImageUploader,
    LanguageLevelsInput,
    TimezonesInput,
    ExpertisesInput,
    LocationsInput
  },
  mixins: [textTranslations, nextStepBtn, serializeData, saveProfileImageData, profileLogoMixin],
  data() {
    return {
      translationScope: 'setupAccount',
      loading: false,
      location: null,
      form: {
        title: null,
        timezone: null,
        hourlyRate: null,
        availability: null
      },
      expertiseId: null,
      upploadedAvatar: null,
      englishProficiency: null
    };
  },
  computed: {
    ...mapState({
      freelancerId: state => state.auth.user.freelancer.id,
      activeProfile: state => state.auth.user.activeProfile,
      profile: state => state.auth.user
    }),
    ...mapGetters('auth', [
      'languages'
    ]),
    profileLogo() {
      return this.logo ? this.logo.md : null;
    }
  },
  watch: {
    location(val, oldVal) {
      if (oldVal && val !== oldVal) {
        this.form.timezone = null;
      }
    }
  },
  mounted() {
    this.form.title = this.activeProfile.title;
    this.location = this.activeProfile.location;
    this.form.timezone = this.activeProfile.timezone;
    this.englishProficiency = this.languages ? this.languages.en : null;
    this.form.availability = this.activeProfile.availability;
    this.form.hourlyRate = this.activeProfile.hourlyRate;
    this.expertiseId = this.activeProfile.expertise ? this.activeProfile.expertise.id : null;
  },
  methods: {
    ...mapActions({
      updateFreelancer: 'setupFreelancer/updateFreelancer'
    }),
    ...mapMutations('auth', [
      'SET_CLIENT_PROFILE_DATA',
      'UPDATE_PROFILE_LOGO'
    ]),
    async nextStep() {
      const isValid = await this.$validator.validate();

      if (!isValid) return;
      await this.updateFreelancerBasicInfo();
      this.goToNextStep();
    },
    async updateFreelancerBasicInfo() {
      this.loading = true;
      try {
        const data = {
          id: this.freelancerId,
          type: 'freelancer',
          location: this.location,
          languages: {
            en: this.englishProficiency
          },
          ...this.form,
          expertise: {
            id: this.expertiseId,
            type: 'expertise'
          },
          relationshipNames: ['expertise']
        };
        const updatedData = await this.updateFreelancer(this.serializeData(data));
        const updatedProfile = Object.assign({}, updatedData);
        delete updatedProfile.included;
        const updatedLogo = updatedData.included.find(item => item.type === 'profileImage');
        this.SET_CLIENT_PROFILE_DATA(updatedProfile);
        if (updatedLogo) {
          this.UPDATE_PROFILE_LOGO({
            data: updatedLogo
          });
        }
      } finally {
        this.loading = false;
      }
    },
    async handleImageUppload(imageData) {
      const { sm } = await this.saveProfileImageData(imageData, this.freelancerId, 'freelancer', 'profileImage');

      this.upploadedAvatar = sm;
    }
  }
};
</script>
