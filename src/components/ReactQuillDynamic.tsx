import dynamic from 'next/dynamic';

const ReactQuillDynamic = dynamic(() => import('react-quill-new'), { ssr: false });

export default ReactQuillDynamic;
