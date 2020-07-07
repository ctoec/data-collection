import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, TextWithIcon } from '@ctoec/component-library'
import { ReactComponent as ArrowRight } from 'uswds/dist/img/arrow-right.svg';
import { ReactComponent as TeacherWithChalkboard } from '@ctoec/component-library/dist/assets/images/teacherWithChalkboard.svg';
import HomeCareerBubbleSrc from '@ctoec/component-library/dist/assets/images/homeCareerBubble.png';

import UserContext from '../../contexts/UserContext/UserContext';

import cx from 'classnames';
import styles from './Home.module.scss';

const Home: React.FC = () => {
	const { user, loading } = useContext(UserContext);
	const history = useHistory();

	// To prevent flash of splash page if user is logged in
	if (loading) {
		return <></>;
	}

	// If the user is logged in, don't show the splash page
	if (user) {
		history.push('/upload');
		return <></>;
	}

	return (
		<div className={cx(styles.container)}>
			<div className={cx('usa-hero', styles.hero)}>
				<div>
					<h1 className="margin-bottom-2">Upload your enrollment data</h1>
					<Button
						className={cx(styles['btn--inverse'])}
						href="/login"
						text="Sign in"
						appearance="base"
					/>
				</div>
			</div>
			<div className="grid-container margin-top-4">
				<div className="grid-row">
					<div className="tablet:grid-col-auto margin-right-4 padding-4">
						<img
							className={cx(styles['hero-bubble'])}
							src={HomeCareerBubbleSrc}
							alt="Children playing on the floor watched by a child care provider"
						/>
					</div>
					<div className="tablet:grid-col-fill">
						<h2 className="text-primary text-light margin-y-3">
							We support affordable child care in Connecticut
						</h2>
						<p className="line-height-sans-5">
							Publicly-funded early care and education programs use ECE Reporter to share data with
							the Connecticut Office of Early Childhood.
						</p>
						<p>
							The Office of Early Childhood uses this data to pay programs and help
							families access quality care.
						</p>
						<div className="margin-bottom-6">
							<p className="text-bold">Learn more</p>
							<Button
								appearance="unstyled"
								href="https://ctoec.org"
								className="text-bold"
								text={
									<TextWithIcon
										text="Visit OEC's website"
										Icon={ArrowRight}
										direction="right"
										iconSide="right"
										className="text-underline"
									/>
								}
							/>
							<br />
							<br />
							<Button
								appearance="unstyled"
								href="/privacy-policy"
								className="text-bold"
								text={
									<TextWithIcon
										text="See the privacy policy"
										Icon={ArrowRight}
										direction="right"
										iconSide="right"
										className="text-underline"
									/>
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={cx('bg-base-lightest', 'height-15', styles.footer)}>
				<div className="display-flex flex-justify flex-align-center">
					<p className="text-primary text-light font-sans-lg">Find out what's new at OEC</p>
					<Button
						className={cx(styles['usa-button'], 'bg-accent-cool-darker radius-0')}
						text={
							// TODO: use TextWithIcon here
							<span className="display-flex flex-align-center">
								<span>Visit the OEC website</span>
								<ArrowRight aria-hidden width="20" height="20" className="margin-left-3" />
							</span>
						}
						href="https://ctoec.org"
						external={true}
						appearance="default"
					/>
				</div>
			</div>
		</div>
	);
}

export default Home;