package com.example.restaurante.model;

import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido {

    public interface BasicView {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(BasicView.class)
    private Long id;

    @JsonView(BasicView.class)
    private String nomeCliente;

    @JsonView(BasicView.class)
    private String endereco;

    @JsonView(BasicView.class)
    private String descricao;

    @JsonView(BasicView.class)
    private double valorTotal;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonView(BasicView.class)
    private List<Item> itens = new ArrayList<>();

    // Construtores

    public Pedido() {
    }

    public Pedido(String nomeCliente, String endereco, String descricao, double valorTotal) {
        this.nomeCliente = nomeCliente;
        this.endereco = endereco;
        this.descricao = descricao;
        this.valorTotal = valorTotal;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<Item> getItens() {
        return itens;
    }

    public void setItens(List<Item> itens) {
        this.itens = itens;
    }

    // Métodos auxiliares

    public void addItem(Item item) {
        itens.add(item);
        item.setPedido(this);
    }

    public void removeItem(Item item) {
        itens.remove(item);
        item.setPedido(null);
    }
}