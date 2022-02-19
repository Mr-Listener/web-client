import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import PageTitle from 'components/logic/PageTitle';
import DeleteIconButton from 'components/ui/buttons/DeleteIconButton';
import MailLink from "components/ui/MailLink";
import LoadingTableRow from 'components/ui/tables/LoadingTableRow';
import NoResultsTableRow from 'components/ui/tables/NoResultsTableRow';
import TelephoneLink from "components/ui/TelephoneLink";
import { useNavigate } from 'react-router-dom';
import useDelete from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import Breadcrumb from '../ui/Breadcrumb';
import CreateButton from "../ui/buttons/Create";
import LinkButton from "../ui/buttons/Link";
import ExternalLink from "../ui/ExternalLink";
import { IconBriefcase } from '../ui/Icons';
import Title from '../ui/Title';
import ClientLink from "./Link";

const ClientsList = () => {
    const navigate = useNavigate();
    const [clients, updateTasks] = useFetch('/clients')

    const destroy = useDelete('/clients/', updateTasks);
    const handleCreateClient = () => {
        navigate(`/clients/create`)
    }

    return <>
        <PageTitle value="Clients" />
        <div className='heading'>
            <Breadcrumb />

            <CreateButton onClick={handleCreateClient}>Create Client</CreateButton>
        </div>
        <Title title='Clients' icon={<IconBriefcase />} />

        <Table>
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Address</Th>
                    <Th>URL</Th>
                    <Th>Contact name</Th>
                    <Th>Contact email</Th>
                    <Th colSpan={2}>Contact phone</Th>
                </Tr>
            </Thead>
            <Tbody>
                {null === clients && <LoadingTableRow numColumns={7} />}
                {null !== clients && 0 === clients.length && <NoResultsTableRow numColumns={7} />}
                {null !== clients && 0 < clients.length && clients.map((client) =>
                    <Tr key={client.id}>
                        <Td><ClientLink clientId={client.id}>{client.name}</ClientLink></Td>
                        <Td>{client.address || '-'}</Td>
                        <Td>{client.url ? <ExternalLink href={client.url}>{client.url}</ExternalLink> : '-'}</Td>
                        <Td>{client.contact_name || '-'}</Td>
                        <Td><MailLink email={client.contact_email} /></Td>
                        <Td><TelephoneLink number={client.contact_phone} /></Td>
                        <Td className='flex justify-end'>
                            <LinkButton href={`/clients/${client.id}/edit`}>Edit</LinkButton>
                            <DeleteIconButton onClick={() => destroy(client.id)} />
                        </Td>
                    </Tr>
                )
                }
            </Tbody>
        </Table>
    </>
}

export default ClientsList
