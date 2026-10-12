import type { Option } from '@/components/form/MultiSelect';

export const civilStatusOption: Option[] = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'separated', label: 'Separated' },
    { value: 'widowed', label: 'Widowed' },
];

export const employmentTypeOptions: Option[] = [
    { value: 'regular', label: 'Regular' },
    { value: 'probationary', label: 'Probationary' },
    { value: 'contractual', label: 'Contractual' },
    { value: 'part_time', label: 'Part-time' },
];

export const workSetupOption: Option[] = [
    { value: 'onsite', label: 'On-site' },
    { value: 'wfh', label: 'Work from home' },
    { value: 'hybrid', label: 'Hybrid' },
];