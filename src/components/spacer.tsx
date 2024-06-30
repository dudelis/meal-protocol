import * as React from 'react';
import styles from './spacer.module.css'

export interface ISpacerProps {
}

export const Spacer = (props: ISpacerProps) => <div className="pt-8 md:pt-10 lg:pt-12 xl:pt-14 2xl:pt-16" aria-hidden="true" />