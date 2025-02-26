import { Alert, AlertIcon } from '@chakra-ui/alert';
import { useDisclosure } from '@chakra-ui/hooks';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import PageTitle from 'components/logic/PageTitle';
import Breadcrumb from 'components/ui/Breadcrumb';
import CreateButton from 'components/ui/buttons/Create';
import DeleteIconButton from 'components/ui/buttons/DeleteIconButton';
import SecondaryButton from 'components/ui/buttons/Secondary';
import EmptyField from 'components/ui/EmptyField';
import ExternalLink from 'components/ui/ExternalLink';
import { IconDocument, IconDocumentDuplicate } from 'components/ui/Icons';
import Loading from 'components/ui/Loading';
import NoResults from 'components/ui/NoResults';
import Title from 'components/ui/Title';
import { resolveMime } from 'friendly-mimes';
import useDelete from 'hooks/useDelete';
import useFetch from 'hooks/useFetch';
import { Link } from 'react-router-dom';
import { UserManualUrl } from 'ServerUrls';
import secureApiFetch from 'services/api';
import ReportModalDialog from './ModalDialog';

const ReportTemplatesList = () => {
    const [templates, refetchTemplates] = useFetch('/reports/templates')

    const destroy = useDelete('/reports/', refetchTemplates);

    const deleteTemplate = (ev, templateId) => {
        ev.stopPropagation();

        destroy(templateId);
    }

    const { isOpen: isAddReportTemplateDialogOpen, onOpen: openAddReportTemplateDialog, onClose: closeAddReportTemplateDialog } = useDisclosure();

    const onReportTemplateFormSaved = () => {
        refetchTemplates();
        closeAddReportTemplateDialog();
    }

    const handleDownload = (reportId) => {
        secureApiFetch(`/attachments/${reportId}`, { method: 'GET', headers: {} })
            .then(resp => {
                const contentDispositionHeader = resp.headers.get('Content-Disposition');
                const filenameRe = new RegExp(/filename="(.*)";/)
                const filename = filenameRe.exec(contentDispositionHeader)[1]
                return Promise.all([resp.blob(), filename]);
            })
            .then((values) => {
                const blob = values[0];
                const filename = values[1];
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            })
    }

    const safeResolveMime = mimeType => {
        try {
            return resolveMime(mimeType)['name']
        } catch (err) {
            console.error(err);
            return mimeType;
        }
    }
    return <>
        <PageTitle value="Report templates" />
        <div className='heading'>
            <Breadcrumb>
                <Link to="/reports">Reports</Link>
            </Breadcrumb>

            <ReportModalDialog isOpen={isAddReportTemplateDialogOpen} onSubmit={onReportTemplateFormSaved} onCancel={closeAddReportTemplateDialog} />
            <CreateButton onClick={openAddReportTemplateDialog}>Add report template...</CreateButton>
        </div>
        <Title title='Report templates' icon={<IconDocumentDuplicate />} />

        <Alert status="info">
            <AlertIcon />
            Needing some inspiration? Have a look at hundred of penetration test reports available at&nbsp;<ExternalLink href="http://pentestreports.com/">http://pentestreports.com/</ExternalLink>
        </Alert>

        <Alert status="info">
            <AlertIcon />
            Visit this <ExternalLink href={UserManualUrl + 'reports/report-template-variables.html'}>user manual's page</ExternalLink> if you want to find out which variables are available to your report templates.
        </Alert>

        {!templates ? <Loading /> :
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th style={{ width: '190px' }}>Name</Th>
                        <Th>Description</Th>
                        <Th style={{ width: '190px' }}>File name</Th>
                        <Th>Mime type</Th>
                        <Th>Downloads</Th>
                        <Th>&nbsp;</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {templates.length === 0 ?
                        <Tr><Td colSpan={3}><NoResults /></Td></Tr>
                        :
                        templates.map((template) =>
                            <Tr key={template.id}>
                                <Td>{template.version_name}</Td>
                                <Td><EmptyField value={template.version_description} /></Td>
                                <Td>{template.client_file_name}</Td>
                                <Td><span title={safeResolveMime(template.file_mimetype)}>{template.file_mimetype}</span></Td>
                                <Td>
                                    <SecondaryButton onClick={() => handleDownload(template.attachment_id)}>
                                        <IconDocument /> DOCX
                                    </SecondaryButton>
                                </Td>
                                <Td textAlign="right">
                                    <DeleteIconButton disabled={template.generated_by_uid === 0} title={template.generated_by_uid === 0 ? "System templates cannot be deleted" : ""} onClick={ev => deleteTemplate(ev, template.id)} />
                                </Td>
                            </Tr>
                        )
                    }
                </Tbody>
            </Table>
        }
    </>
}

export default ReportTemplatesList;
