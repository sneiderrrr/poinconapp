// ... (tous les imports inchangés)
import React, { useEffect, useState } from "react";
import {
  Button, Card, CardBody, Col, Container, Form,
  Input, Label, Modal, ModalBody, ModalHeader, Row
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

import Breadcrumbs from "/src/components/Common/Breadcrumb";
import DeleteModal from "./DeleteModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import verification from "../../assets/images/verification-img.png";

const EntretienCalendar = () => {
  document.title = "Calendrier des entretiens";

  const [entretien, setEntretien] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [entretienEvents, setEntretienEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // 🔹 Ajouté
  const [selectedEvent, setSelectedEvent] = useState(null); // 🔹 Ajouté pour détails
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded.userId || null);
      } catch (err) {
        console.error("Erreur décodage token:", err);
      }
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token manquant");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchProduits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/produits", {
        headers: getAuthHeaders()
      });
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  };

  const fetchEntretiens = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/entretiens", {
        headers: getAuthHeaders()
      });
      const events = res.data.map((e) => ({
        id: e._id,
        title: `Entretien: ${e.produit?.code || "Sans produit"}`,
        start: new Date(e.date),
        extendedProps: {
          produitId: e.produit?._id,
          produitCode: e.produit?.code,
          commentaire: e.commentaire,
          referenceUtilisation: e.referenceUtilisation,
          nettoyageProduit: e.nettoyage?.produit,
          nettoyageDate: e.nettoyage?.date,
          lubrificationProduit: e.lubrification?.produit,
          lubrificationDate: e.lubrification?.date,
        },
        className: "bg-info text-white",
      }));
      setEntretienEvents(events);
    } catch (err) {
      console.error("Erreur chargement entretiens:", err);
    }
  };

  useEffect(() => {
    fetchProduits();
    fetchEntretiens();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      produit: entretien.produit || "",
      commentaire: entretien.commentaire || "",
      referenceUtilisation: entretien.referenceUtilisation || "",
      nettoyageProduit: entretien.nettoyage?.produit || "",
      nettoyageDate: entretien.nettoyage?.date?.substr(0, 10) || "",
      lubrificationProduit: entretien.lubrification?.produit || "",
      lubrificationDate: entretien.lubrification?.date?.substr(0, 10) || "",
      date: entretien.date
        ? entretien.date.substr(0, 10)
        : selectedDate?.toISOString().substr(0, 10) || "",
    },
    validationSchema: Yup.object({
      produit: Yup.string().required("Produit requis"),
      date: Yup.date().required("Date requise"),
    }),

    onSubmit: async (values) => {
      try {
        const payload = {
          reference: `ENT-${Math.floor(Math.random() * 10000)}`,
          date: new Date(values.date).toISOString(),
          produit: values.produit,
          referenceUtilisation: values.referenceUtilisation,
          commentaire: values.commentaire,
          nettoyage: {
            date: new Date(values.nettoyageDate).toISOString(),
            produit: values.nettoyageProduit,
          },
          lubrification: {
            date: new Date(values.lubrificationDate).toISOString(),
            produit: values.lubrificationProduit,
          },
          utilisateur: userId || null,
        };

        const res = await axios.post("http://localhost:5000/api/entretiens", payload, {
          headers: getAuthHeaders(),
        });

        const produitInfo = produits.find((p) => p._id === values.produit);
        const newEvent = {
          id: res.data._id,
          title: `Entretien: ${produitInfo?.code || values.produit}`,
          start: new Date(values.date),
          extendedProps: {
            produitId: values.produit,
            produitCode: produitInfo?.code,
            commentaire: values.commentaire,
          },
          className: "bg-info text-white",
        };
        setEntretienEvents((prev) => [...prev, newEvent]);
        toggleModal();
      } catch (err) {
        console.error("Erreur sauvegarde:", err);
      }
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setIsEdit(false);
    setEntretien({});
    setSelectedDate(null);
    formik.resetForm();
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setEntretien({});
    setIsEdit(false);
    toggleModal();
  };

  // 🔹 MODIFIÉ : clic sur un événement -> affiche d’abord la modal détails
  const handleEventClick = (arg) => {
    const evt = arg.event;
    setSelectedEvent(evt);
    setDetailModalOpen(true); // ouvre la modal détail
    // Prépare aussi les données si on veut modifier après
    setEntretien({
      id: evt.id,
      produit: evt.extendedProps.produitId,
      commentaire: evt.extendedProps.commentaire,
      referenceUtilisation: evt.extendedProps.referenceUtilisation,
      nettoyage: {
        produit: evt.extendedProps.nettoyageProduit,
        date: evt.extendedProps.nettoyageDate,
      },
      lubrification: {
        produit: evt.extendedProps.lubrificationProduit,
        date: evt.extendedProps.lubrificationDate,
      },
      date: evt.start.toISOString(),
    });
    setSelectedDate(evt.start);
    setIsEdit(true);
    setDeleteId(evt.id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/entretiens/${deleteId}`, {
        headers: getAuthHeaders(),
      });
      setEntretienEvents((prev) => prev.filter((evt) => evt.id !== deleteId));
      setDeleteModal(false);
      toggleModal();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <>
      <DeleteModal show={deleteModal} onDeleteClick={handleDelete} onCloseClick={() => setDeleteModal(false)} />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Entretien" breadcrumbItem="Calendrier des entretiens" />
          <Row>
            <Col xl={3}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleDateClick} className="mb-3">
                    <i className="mdi mdi-plus-circle-outline me-1" /> Ajouter Entretien
                  </Button>
                  <Row className="justify-content-center mt-4">
                    <img src={verification} alt="" className="img-fluid d-block" />
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={9}>
              <Card>
                <CardBody>
                  <FullCalendar
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,listWeek" }}
                    themeSystem="bootstrap"
                    locales={allLocales}
                    locale="fr"
                    events={entretienEvents}
                    editable
                    selectable
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* 🔹 Modal détails lecture seule */}
        <Modal isOpen={detailModalOpen} toggle={() => setDetailModalOpen(false)} centered>
          <ModalHeader toggle={() => setDetailModalOpen(false)}>Détails Entretien</ModalHeader>
          <ModalBody>
            {selectedEvent && (
              <div>
                <p><b>Date :</b> {selectedEvent.start.toLocaleDateString("fr-FR")}</p>
                <p><b>Produit :</b> {selectedEvent.extendedProps.produitCode || "N/A"}</p>
                <p><b>Référence Utilisation :</b> {selectedEvent.extendedProps.referenceUtilisation || "-"}</p>
                <p><b>Produit Nettoyage :</b> {selectedEvent.extendedProps.nettoyageProduit || "-"}</p>
                <p><b>Date Nettoyage :</b> {selectedEvent.extendedProps.nettoyageDate ? new Date(selectedEvent.extendedProps.nettoyageDate).toLocaleDateString("fr-FR") : "-"}</p>
                <p><b>Produit Lubrification :</b> {selectedEvent.extendedProps.lubrificationProduit || "-"}</p>
                <p><b>Date Lubrification :</b> {selectedEvent.extendedProps.lubrificationDate ? new Date(selectedEvent.extendedProps.lubrificationDate).toLocaleDateString("fr-FR") : "-"}</p>
                <p><b>Commentaire :</b> {selectedEvent.extendedProps.commentaire || "-"}</p>
              </div>
            )}
            <div className="text-end mt-3">
              <Button color="secondary" onClick={() => setDetailModalOpen(false)}>Fermer</Button>{" "}
              <Button color="primary" onClick={() => { setDetailModalOpen(false); setModalOpen(true); }}>Modifier</Button>
            </div>
          </ModalBody>
        </Modal>

        {/* 🔹 Modal Formulaire existante */}
        <Modal isOpen={modalOpen} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>{isEdit ? "Modifier Entretien" : "Ajouter Entretien"}</ModalHeader>
          <ModalBody>
            <Form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <Label>Produit</Label>
                <Input type="select" name="produit" onChange={formik.handleChange} value={formik.values.produit}>
                  <option value="">-- Sélectionner un produit --</option>
                  {produits.map((prod) => (
                    <option key={prod._id} value={prod._id}>{prod.code} - {prod.designation}</option>
                  ))}
                </Input>
              </div>
              <div className="mb-3">
                <Label>Date</Label>
                <Input type="date" name="date" onChange={formik.handleChange} value={formik.values.date} />
              </div>
              <div className="mb-3">
                <Label>Produit Nettoyage</Label>
                <Input name="nettoyageProduit" type="text" onChange={formik.handleChange} value={formik.values.nettoyageProduit} />
              </div>
              <div className="mb-3">
                <Label>Date Nettoyage</Label>
                <Input name="nettoyageDate" type="date" onChange={formik.handleChange} value={formik.values.nettoyageDate} />
              </div>
              <div className="mb-3">
                <Label>Produit Lubrification</Label>
                <Input name="lubrificationProduit" type="text" onChange={formik.handleChange} value={formik.values.lubrificationProduit} />
              </div>
              <div className="mb-3">
                <Label>Date Lubrification</Label>
                <Input name="lubrificationDate" type="date" onChange={formik.handleChange} value={formik.values.lubrificationDate} />
              </div>
              <div className="mb-3">
                <Label>Référence Utilisation</Label>
                <Input name="referenceUtilisation" type="text" onChange={formik.handleChange} value={formik.values.referenceUtilisation} />
              </div>
              <div className="mb-3">
                <Label>Commentaire</Label>
                <Input name="commentaire" type="textarea" onChange={formik.handleChange} value={formik.values.commentaire} />
              </div>
              <div className="text-end">
                <Button type="button" color="light" onClick={toggleModal} className="me-2">Fermer</Button>
                <Button type="submit" color="success">Sauvegarder</Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

EntretienCalendar.propTypes = {
  className: PropTypes.string,
};

export default EntretienCalendar;
