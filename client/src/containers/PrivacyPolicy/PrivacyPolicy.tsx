import React from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { BackButton } from '../../components/BackButton';
import { Link } from 'react-router-dom';
import DataDefinitionsTable from '../../components/DataDefinitionsTable/DataDefinitionsTable';

const PrivacyPolicy: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1 ref={h1Ref}>Privacy Policy</h1>
      <p className="text-pre-line">
        The State of Connecticut Office of Early Childhood ("OEC") is committed
        to your privacy. OEC understands that your information is important to
        you, as it is to us. This Privacy Policy will provide you with
        information regarding what information we collect for ECE Reporter, how
        that information is used, and how it is protected.
      </p>
      <h2>What is ECE Reporter?</h2>
      <p>
        ECE Reporter is used by OEC to collect data from early care and
        education providers about the children in their care. Providers record
        their enrollment and submit monthly reports to OEC. OEC uses this data
        to compensate and monitor programs, to report the use of public funds,
        and to study the demand for and benefits of early care and education.
      </p>
      <h2>What is Personally Identifiable Information?</h2>
      <p>
        Personally Identifiable Information (PII) is information that, when used
        alone or with other relevant data, can identify an individual. PII may
        include Sensitive Personally Identifiable Information or Non-sensitive
        Personally Identifiable Information. Sensitive PII includes information
        such as your full name, social security number, driver’s license,
        financial information, and medical records. Non-sensitive PII includes
        information that is often accessible from public sources such as your
        zip code, race, gender, and date of birth.
      </p>
      <h2>What specific types of PII does the OEC collect on ECE Reporter?</h2>
      <p>The following Required PII is collected on ECE Reporter:</p>
      <ul>
        <li>Full Name</li>
        <li>Date of birth</li>
        <li>Place of birth</li>
        <li>Birth certificate ID # (required if born in U.S.)</li>
        <li>Race</li>
        <li>Ethnicity</li>
        <li>Gender</li>
        <li>Enrollment duration</li>
        <li>Age group (infant/toddler, preschool, school-age)</li>
        <li>Exit reason (after withdrawal)</li>
        <li>
          The type and duration of public funds supporting a child’s care (such
          as School Readiness)
        </li>
        <li>Accreditation status</li>
        <li>
          Annual household income and household size (for determining
          eligibility and family fees)
        </li>
        <li>Whether the child is a dual language learner</li>
        <li>Whether the child is receiving services for a disability</li>
      </ul>
      <h2>What other information may be collected?</h2>
      <p>
        Other information that may be collected, but is not required includes:
      </p>
      <ul>
        <li>Whether the child lives with foster family</li>
        <li>State Assigned Student ID (SASID)</li>
        <li>Homelessness status</li>
      </ul>
      <h2>Where can I find the definitions of various PII fields?</h2>
      <p>
        Specific definitions to the various PII listed above can be found in
        Schedule A of this Privacy Policy, along with the rationale for
        collecting it.
      </p>
      <h2>How does the OEC use the information it collects?</h2>
      <p>
        OEC uses data collected from ECE Reporter to provide programs with a
        more streamlined reporting system. OEC currently uses the data for the
        following purposes:
      </p>
      <ul>
        <li>
          To compensate programs, reconciling any difference between the
          services programs were contracted to provide and actual attendance.
        </li>
        <li>
          To monitor programs, such as to ensure that enrollment has been
          correctly recorded and to ensure the fiscal condition of programs.
        </li>
        <li>
          To monitor programs, such as to ensure that enrollment has been
          correctly recorded and to ensure the fiscal condition of programs.
        </li>
        <li>
          To report the use of public funds, such as by reporting demographic
          and geographic breakdowns of the children served.
        </li>
        <li>
          To study demand for early care and education, informing future
          decisions about where and how to fund programs.
        </li>
        <li>
          To support research into the benefits of early care and education,
          such as by examining the effects of quality care on primary school
          outcomes.
        </li>
      </ul>
      <h2>What relevant laws protect my PII shared on ECE reporter?</h2>
      <p>
        The following laws specifically relate to the protection of PII shared
        on ECE Reporter:
      </p>
      <ul>
        <li>
          Provisions of the Family Educational Rights and Privacy Act, 20 U.S.C.
          Section 1232g (FERPA) and the regulations promulgated thereunder
          regarding the disclosure of confidential student information.
        </li>
        <li>
          IDEA Part B regulations as identified in 34 CFR §§ 300.610 through
          300.626 and IDEA Part C regulations as identified in 34 CFR §§ 303.400
          through 303.417 regarding confidentiality requirements to young
          children with disabilities.
        </li>
        <li>
          Provisions of the Health Insurance Portability and Accountability Act
          (HIPAA) and the regulations promulgated thereunder. Information
          obtained pursuant to the provisions of HIPAA shall not be used or
          disclosed by the parties for any purpose without written consent, or
          unless otherwise permitted under HIPAA.
        </li>
      </ul>
      <p>
        Further regulations and laws as applicable may apply including state law
        and the United States Privacy Act of 1974 
        <Link to={{ pathname: "http://www.archives.gov" }} target="_blank">(http://www.archives.gov)</Link>. You
        may obtain more information regarding other data security laws pertinent
        to data shared with State of Connecticut Departments and Agencies
        including the OEC as explained in the State of Connecticut Privacy
        Policy, available at the following link: {' '}
        <Link to={{ pathname: "https://portal.ct.gov/policies/state-privacy-policy/" }} target="_blank">
          https://portal.ct.gov/policies/state-privacy-policy/
        </Link>
        .
      </p>
      <h2>
        Does the State of Connecticut Privacy Policy apply to PII shared on ECE
        Reporter?
      </h2>
      <p>
        Yes. In addition to this Privacy Policy regarding ECE Reporter, the
        State of Connecticut Privacy Policy also applies. If there is not a
        specific provision in this ECE Reporter Privacy Policy, the State of
        Connecticut Privacy Policy will prevail. You may view the State of
        Connecticut Privacy Policy here: 
        <Link to={{ pathname: "https://portal.ct.gov/policies/state-privacy-policy/" }} target="_blank">
          https://portal.ct.gov/policies/state-privacy-policy/.
        </Link>
      </p>
      <h2>How can I access and correct my PII on ECE Reporter?</h2>
      <p>
        If you need to review or correct any information in ECE Reporter, you
        may contact the OEC’s Chief Research and Planning Officer, Rachel
        Leventhal-Weiner at 860-500-4417.
      </p>
      <h2>Is my PII and other data shared on ECE Reporter protected?</h2>
      <p>
        Yes. The OEC takes precautions to protect your information both online
        and offline. The OEC has placed appropriate safeguards to ensure that
        any personal information is secure from destruction, corruption,
        unauthorized access and breach of confidentiality. This effort includes
        an ongoing review of safety measures, implementation of changes, and
        regular training for personnel.
      </p>
      <h2>
        Will there be any changes to the Privacy Policy and how will I be
        notified of such changes?
      </h2>
      <p>
        Yes, there may be changes to the privacy policy as ECE Reporter
        continues to develop. As ECE Reporter is launched, additional changes
        may be needed to improve the tool’s capabilities, depending on provider
        and OEC needs. This Privacy Policy will be updated accordingly as the
        tool develops. The OEC will also notify ECE Reporter users about policy
        changes through notices on this page, which will always contain a
        version number and date. Any information collected under the current
        policy will remain subject to these terms. Information collected after
        any changes take effect will be subject to the revised privacy policy.
      </p>
      <h2>Is my information shared with any other entity?</h2>
      <p>
        We do not disclose, sell, lease or provide any personal information
        about our users to any other government or commercial entity for any
        purpose. We may link data about early care and education to public
        school data through the State Department of Education in order to
        research the benefits of ECE Reporter on educational outcomes and to
        study the effectiveness of the programs OEC regulates. In addition to
        OEC, other State of Connecticut employees approved by OEC may assist
        with this research. Technology contractors approved by OEC and the OEC
        helpdesk may also encounter PII when correcting technological issues.
        OEC takes precautions to limit such access to only data necessary to
        carry out official duties. All such persons as defined above that has
        approved, limited access to data in ECE Reporter must comply with both
        this Privacy Policy and the State of Connecticut Privacy Policy found
        here: 
        <Link to={{ pathname: "https://portal.ct.gov/policies/state-privacy-policy/" }} target="_blank">
          https://portal.ct.gov/policies/state-privacy-policy/.
        </Link>
      </p>
      <h2>
        How can I contact OEC regarding my data on ECE Reporter or obtain more
        information?
      </h2>
      <p>
        For additional questions or concerns, you may contact OEC’s Chief
        Research and Planning Officer, Rachel Leventhal-Weiner at 860-500-4417
        or at Rachel.Leventhal-Weiner@ct.gov.
      </p>
      <h2>Schedule A: Dictionary of Collected Data</h2>
      <DataDefinitionsTable headerLevel="h3" />
    </div>
  );
};

export default PrivacyPolicy;
