<template>
  <!-- hack for volar to accept toggle event -->
  <component
    :is="'details'"
    class="w-full"
    :class="open && 'border rounded-lg overflow-hidden border-blue-200'"
    :open="open"
    @toggle.stop="$emit('toggled', $event.target.open)"
  >
    <summary
      class="
        py-1
        list-none
        c-cycle-edit__summary
        text-gray-700 text-center
        cursor-pointer
        hover:bg-blue-100
        rounded
      "
    >
      <BaseIcon name="wrench" />
      Settings
    </summary>
    <LayoutStack
      tag="form"
      space="1"
      class="px-4 py-2"
      @submit.prevent="onSubmit"
    >
      <IntervalEditBox
        v-for="interval in intervalsRef"
        :key="interval.id"
        :interval="interval"
        @update="update"
        @delete="deleteInterval"
      />
      <LayoutInline :space="3" centered class="mt-2">
        <BaseControl @click="addInterval">
          <BaseIcon name="add-outline" />
          Add
        </BaseControl>
        <BaseControl @click="onCancel">
          <BaseIcon name="close" />
          Cancel
        </BaseControl>
        <BaseControl type="submit">
          <BaseIcon name="save-disk" />
          Save
        </BaseControl>
      </LayoutInline>
    </LayoutStack>
  </component>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { arrayOf, object, bool } from 'vue-types';
import IntervalEditBox from '@/components/IntervalEditBox.vue';
import BaseControl from '@/components/BaseControl.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { Interval } from '@/types';
import { createInterval } from '@/utils';

export default defineComponent({
  components: {
    IntervalEditBox,
    BaseControl,
    BaseIcon,
    LayoutStack,
    LayoutInline,
  },
  props: {
    intervals: arrayOf(object<Interval>()).def([]),
    open: bool().def(false),
  },
  emits: ['save', 'toggled'],
  setup(props, { emit }) {
    const intervalsRef = ref<Interval[]>([...props.intervals]);

    function update(interval: Interval) {
      intervalsRef.value = intervalsRef.value.map((int) =>
        int.id === interval.id ? interval : int,
      );
    }

    function deleteInterval(deleteId: string) {
      intervalsRef.value = intervalsRef.value.filter(
        ({ id }) => deleteId !== id,
      );
    }

    function onSubmit() {
      emit('save', [...intervalsRef.value]);
    }

    function onCancel() {
      intervalsRef.value = [...props.intervals];
      emit('toggled', false);
    }

    function addInterval() {
      intervalsRef.value = [...intervalsRef.value, createInterval()];
    }

    watch(
      () => props.intervals,
      (newIntervals) => {
        intervalsRef.value = newIntervals;
      },
    );

    return {
      intervalsRef,
      update,
      deleteInterval,
      onSubmit,
      addInterval,
      onCancel,
    };
  },
});
</script>
<style lang="postcss" scoped>
.c-cycle-edit__summary::-webkit-details-marker {
  display: none;
}
</style>
